import { Schema } from "effect";
import { FileKey } from "#file/value-objects/file-key";

// Where the browser PUTs the file, and the key the domain then stores in a `FileRef`.
export class FileUpload extends Schema.Class<FileUpload>("FileUpload")({
	key: FileKey,
	uploadUrl: Schema.String,
	expiresAt: Schema.Date,
}) {}
