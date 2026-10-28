import { Schema } from "effect";

export const FileLink = Schema.Struct({
	url: Schema.String,
	expiresAt: Schema.Date,
});

export type FileLink = typeof FileLink.Type;
