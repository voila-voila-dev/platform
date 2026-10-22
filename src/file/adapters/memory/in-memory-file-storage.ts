import { DateTime, Effect, Layer, Option } from "effect";
import { FileLinkLifetime } from "#file/services/file-link-lifetime";
import { FileStorage } from "#file/services/file-storage";
import type { ContentType } from "#file/value-objects/content-type";
import type { FileKey } from "#file/value-objects/file-key";
import { FileLink } from "#file/value-objects/file-link";
import { FileStat } from "#file/value-objects/file-stat";

export interface StoredFile {
	readonly bytes: Uint8Array;
	readonly contentType: ContentType;
}

export function inMemoryFileStorage() {
	const files = new Map<FileKey, StoredFile>();

	return {
		files,
		layer: Layer.succeed(FileStorage, {
			uploadUrl: ({ key }) =>
				Effect.gen(function* () {
					const lifetimes = yield* FileLinkLifetime;
					const now = yield* DateTime.now;
					return FileLink.make({
						url: `https://upload.memory.test/${key}`,
						expiresAt: DateTime.toDateUtc(
							DateTime.addDuration(now, lifetimes.upload),
						),
					});
				}),
			put: ({ key, bytes, contentType }) =>
				Effect.sync(() => {
					files.set(key, { bytes, contentType });
				}),
			read: (key) =>
				Effect.sync(() =>
					Option.map(
						Option.fromNullishOr(files.get(key)),
						(file) => file.bytes,
					),
				),
			stat: (key) =>
				Effect.sync(() =>
					Option.map(Option.fromNullishOr(files.get(key)), (file) =>
						FileStat.make({
							contentType: file.contentType,
							sizeBytes: file.bytes.length,
						}),
					),
				),
			delete: (key) =>
				Effect.sync(() => {
					files.delete(key);
				}),
		}),
	};
}
