import { Schema } from "effect";

export class ImagePreview extends Schema.Class<ImagePreview>("ImagePreview")({
	width: Schema.Int,
	height: Schema.Int,
	// A ThumbHash data URL, painted while the bytes travel.
	placeholder: Schema.String,
	// The widths actually stored, narrowest first: nothing is upscaled, so a
	// small source has fewer than its kind declares.
	variantWidths: Schema.Array(Schema.Int),
}) {}
