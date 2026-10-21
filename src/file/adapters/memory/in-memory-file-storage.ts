import { DateTime, Effect, Layer, Option } from "effect";
import { FileLinkLifetime } from "#file/services/file-link-lifetime";
import { FileStorage } from "#file/services/file-storage";
import type { FileKey } from "#file/value-objects/file-key";

export interface StoredFile {
	readonly bytes: Uint8Array;
	readonly contentType: string;
}

export function inMemoryFileStorage() {
	const files = new Map<FileKey, StoredFile>();

	return {
		files,
		layer: Layer.succeed(FileStorage, {
			uploadUrl: ({ key }) =>
				Effect.gen(function* () {
					const { uploadSeconds } = yield* FileLinkLifetime;
					const now = yield* DateTime.now;
					return {
						url: `https://upload.memory.test/${key}`,
						expiresAt: DateTime.toDateUtc(
							DateTime.add(now, { seconds: uploadSeconds }),
						),
					};
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
					Option.map(Option.fromNullishOr(files.get(key)), (file) => ({
						contentType: file.contentType,
						sizeBytes: file.bytes.length,
					})),
				),
			delete: (key) =>
				Effect.sync(() => {
					files.delete(key);
				}),
		}),
	};
}
