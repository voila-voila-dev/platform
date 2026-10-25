import { describe, expect, it } from "bun:test";
import { Effect, type Layer, Option } from "effect";
import { FileStorageService } from "#file/services/file-storage-service";
import { ContentType } from "#file/value-objects/content-type";
import { FileKey } from "#file/value-objects/file-key";
import { FileStat } from "#file/value-objects/file-stat";

export function fileStorageContract(
	name: string,
	layer: Layer.Layer<FileStorageService>,
	options: { readonly skip?: boolean } = {},
) {
	function run<A>(
		use: (storage: FileStorageService["Service"]) => Effect.Effect<A>,
	) {
		return Effect.runPromise(
			Effect.flatMap(FileStorageService, use).pipe(Effect.provide(layer)),
		);
	}

	const key = FileKey.make(`contract/${crypto.randomUUID()}/pièce.pdf`);
	const bytes = new TextEncoder().encode("%PDF-1.7");
	const PDF = ContentType.make("application/pdf");

	describe.skipIf(options.skip === true)(
		`${name} as a FileStorageService`,
		() => {
			it("misses a key never written", async () => {
				expect(await run((storage) => storage.read(key))).toStrictEqual(
					Option.none(),
				);
				expect(await run((storage) => storage.stat(key))).toStrictEqual(
					Option.none(),
				);
			});

			it("reads back what it was given, with its type and size", async () => {
				await run((storage) => storage.put({ key, bytes, contentType: PDF }));
				expect(await run((storage) => storage.read(key))).toStrictEqual(
					Option.some(bytes),
				);
				expect(await run((storage) => storage.stat(key))).toStrictEqual(
					Option.some(
						FileStat.make({ contentType: PDF, sizeBytes: bytes.length }),
					),
				);
			});

			it("forgets a deleted key, and deletes a missing one without failing", async () => {
				await run((storage) => storage.delete(key));
				await run((storage) => storage.delete(key));
				expect(await run((storage) => storage.read(key))).toStrictEqual(
					Option.none(),
				);
			});

			it("hands an upload link that expires", async () => {
				const link = await run((storage) =>
					storage.uploadUrl({
						key,
						contentType: ContentType.make("image/png"),
						contentLength: 10,
					}),
				);
				expect(link.url).toContain("contract/");
				expect(link.expiresAt.getTime()).toBeGreaterThan(Date.now());
			});
		},
	);
}
