import { DateTime, Duration, Effect, Layer, Option, Schedule } from "effect";
import { normalizeContentTypeOrOctetStream } from "#file/lib/content-type";
import { FileLinkLifetime } from "#file/services/file-link-lifetime";
import { FileStorage } from "#file/services/file-storage";
import { FileLink } from "#file/value-objects/file-link";
import { FileStat } from "#file/value-objects/file-stat";

export interface S3Credentials {
	readonly accessKeyId: string;
	readonly secretAccessKey: string;
	readonly sessionToken?: string;
}

export interface BunS3FileStorageOptions {
	// The account-level endpoint, without the bucket.
	readonly endpoint: string;
	readonly bucket: string;
	// Asked before every call; a different object than the last means the
	// credentials rotated (an ECS task role), and the client is rebuilt.
	readonly credentials: () => Promise<S3Credentials>;
}

// Every call is idempotent, so a transient failure (Bun reports a 5xx or a
// dropped connection as a bare `S3Error`) is retried before it becomes a defect.
const transientRetry = {
	schedule: Schedule.jittered(Schedule.exponential("100 millis")),
	times: 3,
};

interface ObjectReader {
	readonly file: (key: string) => { readonly bytes: () => Promise<Uint8Array> };
	readonly stat: (
		key: string,
	) => Promise<{ readonly type: string; readonly size: number }>;
	readonly exists: (key: string) => Promise<boolean>;
}

// A failed read asks `exists` what happened: a missing key answers `null`,
// anything else rethrows, so a transient failure is retried, not taken for a 404.
async function orNullWhenMissing<A>(
	client: ObjectReader,
	key: string,
	read: () => Promise<A>,
): Promise<A | null> {
	try {
		return await read();
	} catch (cause) {
		if (await client.exists(key)) throw cause;
		return null;
	}
}

export function readObjectBytes(client: ObjectReader, key: string) {
	return orNullWhenMissing(
		client,
		key,
		async () => new Uint8Array(await client.file(key).bytes()),
	);
}

export function statObject(client: ObjectReader, key: string) {
	return orNullWhenMissing(client, key, async () => {
		const stat = await client.stat(key);
		return new FileStat({
			contentType: normalizeContentTypeOrOctetStream(stat.type),
			sizeBytes: stat.size,
		});
	});
}

export function bunS3FileStorage(options: BunS3FileStorageOptions) {
	let signedWith: S3Credentials | null = null;
	let client: Bun.S3Client | null = null;

	async function currentClient(): Promise<Bun.S3Client> {
		const credentials = await options.credentials();
		if (client === null || signedWith !== credentials) {
			client = new Bun.S3Client({
				endpoint: options.endpoint,
				bucket: options.bucket,
				accessKeyId: credentials.accessKeyId,
				secretAccessKey: credentials.secretAccessKey,
				...(credentials.sessionToken === undefined
					? {}
					: { sessionToken: credentials.sessionToken }),
			});
			signedWith = credentials;
		}
		return client;
	}

	function call<A>(name: string, run: (client: Bun.S3Client) => Promise<A>) {
		return Effect.tryPromise({
			try: async () => run(await currentClient()),
			catch: (cause) => cause,
		}).pipe(
			Effect.retry(transientRetry),
			Effect.orDie,
			Effect.withSpan(`FileStorage.${name}`),
		);
	}

	return Layer.succeed(FileStorage, {
		uploadUrl: ({ key, contentType }) =>
			Effect.gen(function* () {
				const lifetimes = yield* FileLinkLifetime;
				const now = yield* DateTime.now;
				const url = yield* call("uploadUrl", async (s3) =>
					s3.presign(key, {
						method: "PUT",
						expiresIn: Duration.toSeconds(lifetimes.upload),
						type: contentType,
					}),
				);
				return new FileLink({
					url,
					expiresAt: DateTime.toDateUtc(
						DateTime.addDuration(now, lifetimes.upload),
					),
				});
			}),
		put: ({ key, bytes, contentType }) =>
			Effect.asVoid(
				call("put", (s3) => s3.write(key, bytes, { type: contentType })),
			),
		read: (key) =>
			Effect.map(
				call("read", (s3) => readObjectBytes(s3, key)),
				Option.fromNullishOr,
			),
		stat: (key) =>
			Effect.map(
				call("stat", (s3) => statObject(s3, key)),
				Option.fromNullishOr,
			),
		delete: (key) => call("delete", (s3) => s3.delete(key)),
	});
}
