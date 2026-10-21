import { describe, expect, it } from "bun:test";
import { narrowestVariantKeyCovering } from "#file/lib/image-variants";
import { ContentType } from "#file/value-objects/content-type";
import { FileKey } from "#file/value-objects/file-key";
import { ImagePreview } from "#file/value-objects/image-preview";
import { ImageRef } from "#file/value-objects/image-ref";

const KEY = FileKey.make("message-attachment/conversation/photo.webp");

function imageRef(variantWidths?: ReadonlyArray<number>): ImageRef {
	return ImageRef.make({
		key: KEY,
		contentType: ContentType.make("image/webp"),
		sizeBytes: 12_000,
		...(variantWidths === undefined
			? {}
			: {
					preview: ImagePreview.make({
						width: 640,
						height: 480,
						placeholder: "data:image/png;base64,iVBORw0KGgo=",
						variantWidths,
					}),
				}),
	});
}

describe("narrowestVariantKeyCovering", () => {
	it("takes the narrowest variant at least as wide as the box", () => {
		expect<string>(
			narrowestVariantKeyCovering(imageRef([256, 512, 1024]), 480),
		).toBe("message-attachment/conversation/photo@512.webp");
	});

	it("takes a variant of exactly the asked width", () => {
		expect<string>(
			narrowestVariantKeyCovering(imageRef([256, 512, 1024]), 256),
		).toBe("message-attachment/conversation/photo@256.webp");
	});

	it("the widths need not be stored in order", () => {
		expect<string>(
			narrowestVariantKeyCovering(imageRef([1024, 256, 512]), 300),
		).toBe("message-attachment/conversation/photo@512.webp");
	});

	it("falls back to the original when every variant is too narrow", () => {
		expect<string>(narrowestVariantKeyCovering(imageRef([256, 512]), 900)).toBe(
			KEY,
		);
	});

	it("falls back to the original when the image carries no preview", () => {
		expect<string>(narrowestVariantKeyCovering(imageRef(), 480)).toBe(KEY);
	});
});
