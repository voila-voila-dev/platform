import { Schema } from "effect";
import { FileKey } from "#file/value-objects/file-key";
import { FileRef } from "#file/value-objects/file-ref";
import { ImagePreview } from "#file/value-objects/image-preview";

export class ImageRef extends Schema.Class<ImageRef>("ImageRef")({
	...FileRef.fields,
	preview: Schema.optional(ImagePreview),
}) {}

export function imageVariantKey(key: FileKey, width: number): FileKey {
	return FileKey.make(`${key.replace(/\.[^./]+$/u, "")}@${width}.webp`);
}
