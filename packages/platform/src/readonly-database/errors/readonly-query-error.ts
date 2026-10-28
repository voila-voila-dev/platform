import { Schema } from "effect";

export class ReadonlyQueryError extends Schema.TaggedError<ReadonlyQueryError>()(
	"ReadonlyQueryError",
	{ message: Schema.String },
) {}
