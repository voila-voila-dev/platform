import { Schema } from "effect";

export class SearchEngineResult extends Schema.Class<SearchEngineResult>(
	"SearchEngineResult",
)({
	url: Schema.String,
	title: Schema.String,
	description: Schema.String,
}) {}
