import { Schema } from "effect";
import { FileKey } from "#file/value-objects/file-key";

export class FileUpload extends Schema.Class<FileUpload>("FileUpload")({
	key: FileKey,
	uploadUrl: Schema.String,
	expiresAt: Schema.Date,
}) {}
