import { describe, expect, it } from "bun:test";
import { Effect, type Layer, Option } from "effect";
import { FileStorage } from "#file/services/file-storage";
import { FileKey } from "#file/value-objects/file-key";

// What every `FileStorage` does, run against each adapter.
export function fileStorageContract(
	name: string,
	layer: Layer.Layer<FileStorage>,
	options: { readonly skip?: boolean } = {},
) {
	function run<A>(use: (storage: FileStorage["Service"]) => Effect.Effect<A>) {
		return Effect.runPromise(
			Effect.flatMap(FileStorage, use).pipe(Effect.provide(layer)),
		);
	}

	const key = FileKey.make(`contract/${crypto.randomUUID()}/pièce.pdf`);
	const bytes = new TextEncoder().encode("%PDF-1.7");

	describe.skipIf(options.skip === true)(`${name} as a FileStorage`, () => {
		it("misses a key never written", async () => {
			expect(await run((storage) => storage.read(key))).toStrictEqual(
				Option.none(),
			);
			expect(await run((storage) => storage.stat(key))).toStrictEqual(
				Option.none(),
			);
		});

		it("reads back what it was given, with its type and size", async () => {
			await run((storage) =>
				storage.put({ key, bytes, contentType: "application/pdf" }),
			);
			expect(await run((storage) => storage.read(key))).toStrictEqual(
				Option.some(bytes),
			);
			expect(await run((storage) => storage.stat(key))).toStrictEqual(
				Option.some({
					contentType: "application/pdf",
					sizeBytes: bytes.length,
				}),
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
				storage.uploadUrl({ key, contentType: "image/png", contentLength: 10 }),
			);
			expect(link.url).toContain("contract/");
			expect(link.expiresAt.getTime()).toBeGreaterThan(Date.now());
		});
	});
}
