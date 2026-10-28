import { describe, expect, it } from "bun:test";
import { Effect, Option } from "effect";
import { bunS3FileStorage } from "#file/adapters/bun/bun-s3-file-storage";
import { FileStorageService } from "#file/services/file-storage-service";
import { fileStorageContract } from "#file/services/file-storage-service.test-helper";
import { ContentType } from "#file/value-objects/content-type";
import { FileKey } from "#file/value-objects/file-key";

const endpoint = process.env.S3_ENDPOINT;

const layer = bunS3FileStorage({
	endpoint: endpoint ?? "",
	bucket: process.env.S3_BUCKET ?? "platform-test",
	credentials: () =>
		Promise.resolve({
			accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
		}),
});

fileStorageContract("bunS3FileStorage", layer, {
	skip: endpoint === undefined,
});

describe.skipIf(endpoint === undefined)("bunS3FileStorage", () => {
	it("stores what the browser PUTs to the upload link", async () => {
		const key = FileKey.make(`upload/${crypto.randomUUID()}.png`);
		const bytes = new Uint8Array([137, 80, 78, 71]);
		const read = await Effect.runPromise(
			Effect.gen(function* () {
				const storage = yield* FileStorageService;
				const link = yield* storage.uploadUrl({
					key,
					contentType: ContentType.make("image/png"),
					contentLength: bytes.length,
				});
				const response = yield* Effect.promise(() =>
					fetch(link.url, {
						method: "PUT",
						body: bytes,
						headers: { "content-type": "image/png" },
					}),
				);
				expect(response.status).toBe(200);
				const stored = yield* storage.read(key);
				yield* storage.delete(key);
				return stored;
			}).pipe(Effect.provide(layer)),
		);
		expect(read).toStrictEqual(Option.some(bytes));
	});
});
