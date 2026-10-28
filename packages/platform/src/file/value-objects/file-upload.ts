import { Schema } from "effect";
import { FileKey } from "#file/value-objects/file-key";

export const FileUpload = Schema.Struct({
	key: FileKey,
	uploadUrl: Schema.String,
	expiresAt: Schema.Date,
});

export type FileUpload = typeof FileUpload.Type;
