import { Schema } from "effect";

export class ScreenshotError extends Schema.TaggedError<ScreenshotError>()(
	"ScreenshotError",
	{ url: Schema.String, reason: Schema.String },
) {}
