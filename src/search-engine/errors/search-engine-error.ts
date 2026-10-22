import { Schema } from "effect";

export class SearchEngineError extends Schema.TaggedError<SearchEngineError>()(
	"SearchEngineError",
	{
		query: Schema.String,
		reason: Schema.String,
	},
) {}
