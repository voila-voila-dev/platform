import { describe, expect, it } from "bun:test";
import { Effect, Exit, Option } from "effect";
import { inMemoryFiles } from "#file/adapters/memory/in-memory-files";
import { FileUploadRejectedError } from "#file/errors/file-upload-rejected-error";
import { Files } from "#file/lib/files";
import { ContentType } from "#file/value-objects/content-type";
import { FileKey } from "#file/value-objects/file-key";
import { FileUpload } from "#file/value-objects/file-upload";
import { ImagePreview } from "#file/value-objects/image-preview";
import { ImageRef } from "#file/value-objects/image-ref";

const AppFiles = Files.make({
	defaultVariantWidths: [320, 640, 1280],
	kinds: {
		avatar: {
			prefix: "user-avatar/",
			visibility: "public",
			upload: {
				contentTypes: [
					ContentType.make("image/png"),
					ContentType.make("image/webp"),
				],
				maxBytes: 1_000,
			},
			variantWidths: [64, 128],
		},
		invoice: { prefix: "invoice/", visibility: "private" },
		supplierInvoice: { prefix: "supplier-invoice/", visibility: "private" },
		story: { prefix: "story/", visibility: "private" },
	},
});

function upload(contentType: string, contentLength: number) {
	const files = inMemoryFiles();
	return Effect.runPromise(
		Effect.exit(
			AppFiles.requestUpload("avatar", {
				scope: "u1",
				contentType,
				contentLength,
			}).pipe(Effect.provide(files.layer)),
		),
	);
}

describe("Files", () => {
	it("builds a key under the kind's prefix", () => {
		expect(AppFiles.key("invoice", "order-1", "F-001.pdf")).toBe(
			FileKey.make("invoice/order-1/F-001.pdf"),
		);
	});

	it("parses a key back into its kind and segments, the longest prefix first", () => {
		expect(AppFiles.parse("supplier-invoice/order-1/a.pdf")).toStrictEqual(
			Option.some({ kind: "supplierInvoice", segments: ["order-1", "a.pdf"] }),
		);
		expect(AppFiles.parse("elsewhere/a.pdf")).toStrictEqual(Option.none());
	});

	it("serves only public kinds to anyone, and nothing it does not know", () => {
		expect(AppFiles.isPublic("user-avatar/u1/a.png")).toBe(true);
		expect(AppFiles.isPublic("invoice/o1/a.pdf")).toBe(false);
		expect(AppFiles.isPublic("unknown/a.png")).toBe(false);
		expect(AppFiles.isPublic("")).toBe(false);
	});

	it("reads the variant widths off the kind, else the default", () => {
		expect(AppFiles.variantWidths("user-avatar/u1/a.webp")).toStrictEqual([
			64, 128,
		]);
		expect(AppFiles.variantWidths("story/a.webp")).toStrictEqual([
			320, 640, 1280,
		]);
	});

	it("drops the preview widths its kind does not declare", () => {
		const ref = new ImageRef({
			key: FileKey.make("user-avatar/u1/a.webp"),
			contentType: ContentType.make("image/webp"),
			sizeBytes: 10,
			preview: new ImagePreview({
				width: 1,
				height: 1,
				placeholder: "",
				variantWidths: [64, 999],
			}),
		});
		expect(
			AppFiles.withDeclaredVariantWidths(ref).preview?.variantWidths,
		).toStrictEqual([64]);
	});

	it("hands an upload link for a declared file, under a fresh key", async () => {
		const exit = await upload("image/PNG; charset=binary", 500);
		const requested = Exit.isSuccess(exit) ? exit.value : undefined;
		expect(requested).toBeInstanceOf(FileUpload);
		expect(requested).toMatchObject({
			key: FileKey.make(
				"user-avatar/u1/00000000-0000-0000-0000-000000000001.png",
			),
			uploadUrl:
				"https://upload.memory.test/user-avatar/u1/00000000-0000-0000-0000-000000000001.png",
		});
	});

	it("rejects an upload of another type, empty, or too large", async () => {
		for (const [contentType, length, reason] of [
			["image/gif", 500, "unsupportedContentType"],
			["image/png", 0, "empty"],
			["image/png", Number.NaN, "empty"],
			["image/png", 1_001, "tooLarge"],
			["image/png", Number.POSITIVE_INFINITY, "tooLarge"],
		] as const) {
			expect(await upload(contentType, length)).toStrictEqual(
				Exit.fail(new FileUploadRejectedError({ reason })),
			);
		}
	});

	it("refuses an upload for a kind without an upload rule, at compile time", () => {
		function uploadInvoice() {
			// @ts-expect-error invoices are never uploaded from a browser
			return AppFiles.validateUpload("invoice", {
				contentType: "application/pdf",
				contentLength: 1,
			});
		}
		expect(uploadInvoice).toThrow();
	});
});
