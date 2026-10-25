import { Schema } from "effect";
import { ContentType } from "#file/value-objects/content-type";

export const Screenshot = Schema.Struct({
	content: Schema.Uint8Array,
	contentType: ContentType,
	width: Schema.Number,
	height: Schema.Number,
});

export type Screenshot = typeof Screenshot.Type;
