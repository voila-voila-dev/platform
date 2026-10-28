import { Schema } from "effect";

export const ImagePreview = Schema.Struct({
	width: Schema.Int,
	height: Schema.Int,
	placeholder: Schema.String,
	variantWidths: Schema.Array(Schema.Int),
});
export type ImagePreview = typeof ImagePreview.Type;
