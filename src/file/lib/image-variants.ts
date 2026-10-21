import type { FileKey } from "#file/value-objects/file-key";
import { type ImageRef, imageVariantKey } from "#file/value-objects/image-ref";

// The original when every variant is narrower than the box: a picture is never upscaled.
export function narrowestVariantKeyCovering(
	ref: ImageRef,
	targetPx: number,
): FileKey {
	const covering = (ref.preview?.variantWidths ?? [])
		.filter((width) => width >= targetPx)
		.sort((left, right) => left - right);
	const narrowest = covering[0];
	return narrowest === undefined
		? ref.key
		: imageVariantKey(ref.key, narrowest);
}
