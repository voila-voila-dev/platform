import { Schema } from "effect";

export class ImportDraftNotFoundError extends Schema.TaggedError<ImportDraftNotFoundError>()(
	"ImportDraftNotFoundError",
	{ id: Schema.String },
) {}
