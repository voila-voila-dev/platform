import { Schema } from "effect";

export const ImportRejection = Schema.Literals([
	"tooLarge",
	"tooManyRows",
	"empty",
	"unreadable",
	"unsupportedFormat",
]);

export type ImportRejection = typeof ImportRejection.Type;

export class ImportFileRejectedError extends Schema.TaggedError<ImportFileRejectedError>()(
	"ImportFileRejectedError",
	{ reason: ImportRejection },
) {}
