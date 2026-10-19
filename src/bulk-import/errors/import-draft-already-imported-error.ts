import { Schema } from "effect";

export class ImportDraftAlreadyImportedError extends Schema.TaggedError<ImportDraftAlreadyImportedError>()(
	"ImportDraftAlreadyImportedError",
	{ id: Schema.String },
) {}
