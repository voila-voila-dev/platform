import { Schema } from "effect";
import { FileKey } from "#file/value-objects/file-key";

export class FileRef extends Schema.Class<FileRef>("FileRef")({
	key: FileKey,
	contentType: Schema.String,
	sizeBytes: Schema.Int,
	originalFilename: Schema.optional(Schema.String),
}) {}
