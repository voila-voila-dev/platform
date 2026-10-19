import { Schema } from "effect";

export class ImportTargetNotFoundError extends Schema.TaggedError<ImportTargetNotFoundError>()(
	"ImportTargetNotFoundError",
	{ target: Schema.String },
) {}
