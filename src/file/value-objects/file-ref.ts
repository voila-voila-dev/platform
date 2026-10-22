import { Schema } from "effect";
import { ContentType } from "#file/value-objects/content-type";
import { FileKey } from "#file/value-objects/file-key";

export const FileRef = Schema.Struct({
	key: FileKey,
	contentType: ContentType,
	sizeBytes: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)),
	originalFilename: Schema.optional(Schema.String),
});
export type FileRef = typeof FileRef.Type;
