import { Schema } from "effect";

export const ScreenshotRequest = Schema.Struct({
	url: Schema.String,
	width: Schema.Number,
	height: Schema.Number,
});

export type ScreenshotRequest = typeof ScreenshotRequest.Type;
