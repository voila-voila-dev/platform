import { Schema } from "effect";
import { FileKey } from "#file/value-objects/file-key";
import { FileRef } from "#file/value-objects/file-ref";
import { ImagePreview } from "#file/value-objects/image-preview";

export const ImageRef = Schema.Struct({
	...FileRef.fields,
	preview: Schema.optional(ImagePreview),
});
export type ImageRef = typeof ImageRef.Type;

export function imageVariantKey(key: FileKey, width: number): FileKey {
	return FileKey.make(`${key.replace(/\.[^./]+$/u, "")}@${width}.webp`);
}
