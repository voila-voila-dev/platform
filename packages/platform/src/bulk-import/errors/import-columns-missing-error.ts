import { Schema } from "effect";

// No cell edit can add a column, so the file is refused rather than kept as an intent.
export class ImportColumnsMissingError extends Schema.TaggedError<ImportColumnsMissingError>()(
	"ImportColumnsMissingError",
	{ columns: Schema.NonEmptyArray(Schema.String) },
) {}
