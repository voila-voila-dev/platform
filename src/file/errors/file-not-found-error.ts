import { Schema } from "effect";
import { FileKey } from "#file/value-objects/file-key";

export class FileNotFoundError extends Schema.TaggedError<FileNotFoundError>()(
	"FileNotFoundError",
	{ key: FileKey },
) {}
