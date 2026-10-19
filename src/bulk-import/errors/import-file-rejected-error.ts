import { Schema } from "effect";

export const ImportRejection = Schema.Literals([
	"TooLarge",
	"TooManyRows",
	"Empty",
	"Unreadable",
	"UnsupportedFormat",
]);

export type ImportRejection = typeof ImportRejection.Type;

export class ImportFileRejectedError extends Schema.TaggedError<ImportFileRejectedError>()(
	"ImportFileRejectedError",
	{ reason: ImportRejection },
) {}
