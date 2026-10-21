import { Schema } from "effect";

export const FileUploadRejection = Schema.Literals([
	"unsupportedContentType",
	"empty",
	"tooLarge",
]);

export type FileUploadRejection = typeof FileUploadRejection.Type;

export class FileUploadRejectedError extends Schema.TaggedError<FileUploadRejectedError>()(
	"FileUploadRejectedError",
	{ reason: FileUploadRejection },
) {}
