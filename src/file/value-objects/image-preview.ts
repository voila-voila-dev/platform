import { Schema } from "effect";

export class ImagePreview extends Schema.Class<ImagePreview>("ImagePreview")({
	width: Schema.Int,
	height: Schema.Int,
	placeholder: Schema.String,
	variantWidths: Schema.Array(Schema.Int),
}) {}
