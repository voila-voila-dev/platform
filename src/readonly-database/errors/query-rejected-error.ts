import { Schema } from "effect";

export class QueryRejectedError extends Schema.TaggedError<QueryRejectedError>()(
	"QueryRejectedError",
	{ message: Schema.String },
) {}
