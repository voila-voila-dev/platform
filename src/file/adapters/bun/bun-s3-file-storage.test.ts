import { describe, expect, it } from "bun:test";
import {
	readObjectBytes,
	statObject,
} from "#file/adapters/bun/bun-s3-file-storage";
import { ContentType } from "#file/value-objects/content-type";
import { FileStat } from "#file/value-objects/file-stat";

const KEY = "user-avatar/u1/avatar.png";
const BYTES = new Uint8Array([137, 80, 78, 71]);

function transientFailure() {
	const error = new Error("an unexpected error has occurred");
	error.name = "S3Error";
	return error;
}

function reader(options: {
	readonly fails?: boolean;
	readonly exists: boolean | Error;
}) {
	const calls = { exists: 0 };
	return {
		calls,
		client: {
			file: () => ({
				bytes: async () => {
					if (options.fails === true) throw transientFailure();
					return BYTES;
				},
			}),
			stat: async () => {
				if (options.fails === true) throw transientFailure();
				return { type: "image/png", size: 4 };
			},
			exists: async () => {
				calls.exists++;
				if (options.exists instanceof Error) throw options.exists;
				return options.exists;
			},
		},
	};
}

describe.each([
	["readObjectBytes", readObjectBytes, BYTES],
	[
		"statObject",
		statObject,
		new FileStat({ contentType: ContentType.make("image/png"), sizeBytes: 4 }),
	],
] as const)("%s", (_name, read, expected) => {
	it("answers in one round trip", async () => {
		const { client, calls } = reader({ exists: true });
		expect(await read(client, KEY)).toStrictEqual(expected);
		expect(calls.exists).toBe(0);
	});

	it("reports a missing key as null", async () => {
		expect(
			await read(reader({ fails: true, exists: false }).client, KEY),
		).toBeNull();
	});

	it("rethrows a failure on a key that exists, so it is retried", async () => {
		await expect(
			read(reader({ fails: true, exists: true }).client, KEY),
		).rejects.toThrow("an unexpected error has occurred");
	});

	it("rethrows when the existence probe fails", async () => {
		await expect(
			read(
				reader({ fails: true, exists: new Error("probe down") }).client,
				KEY,
			),
		).rejects.toThrow("probe down");
	});
});
