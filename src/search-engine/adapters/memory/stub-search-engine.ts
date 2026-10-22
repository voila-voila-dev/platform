import { Effect, Layer } from "effect";
import { SearchEngine } from "#search-engine/services/search-engine";
import type { SearchEngineResult } from "#search-engine/value-objects/search-engine-result";

export function stubSearchEngine(
	results: ReadonlyArray<SearchEngineResult> = [],
) {
	const queries: Array<string> = [];
	return {
		queries,
		layer: Layer.succeed(SearchEngine, {
			search: ({ query }) =>
				Effect.sync(() => {
					queries.push(query);
					return results;
				}),
		}),
	};
}
