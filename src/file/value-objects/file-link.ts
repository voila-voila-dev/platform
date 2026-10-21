import { Schema } from "effect";

export class FileLink extends Schema.Class<FileLink>("FileLink")({
	url: Schema.String,
	expiresAt: Schema.Date,
}) {}
