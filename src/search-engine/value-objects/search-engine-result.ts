import { Schema } from "effect";

export const SearchEngineResult = Schema.Struct({
	url: Schema.String,
	title: Schema.String,
	description: Schema.String,
});
export type SearchEngineResult = typeof SearchEngineResult.Type;
