import { Schema } from "effect";

export class ImportDraftNotEditableError extends Schema.TaggedError<ImportDraftNotEditableError>()(
	"ImportDraftNotEditableError",
	{ id: Schema.String, status: Schema.String },
) {}
