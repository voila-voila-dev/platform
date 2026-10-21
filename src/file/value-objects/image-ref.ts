import { Schema } from "effect";
import { FileKey } from "#file/value-objects/file-key";
import { FileRef } from "#file/value-objects/file-ref";
import { ImagePreview } from "#file/value-objects/image-preview";

// Encodes as a `FileRef` plus one optional field, so a stored `FileRef`
// decodes as an `ImageRef` without a preview.
export class ImageRef extends Schema.Class<ImageRef>("ImageRef")({
	...FileRef.fields,
	preview: Schema.optional(ImagePreview),
}) {}

// Beside the original, so whoever may read one may read the other.
export function imageVariantKey(key: FileKey, width: number): FileKey {
	return FileKey.make(`${key.replace(/\.[^./]+$/u, "")}@${width}.webp`);
}
