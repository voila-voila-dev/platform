import { Effect, Layer } from "effect";
import {
	SearchEngine,
	type SearchEngineQuery,
} from "#search-engine/services/search-engine";
import type { SearchEngineResult } from "#search-engine/value-objects/search-engine-result";

export function stubSearchEngine(
	results: ReadonlyArray<SearchEngineResult> = [],
) {
	const searches: Array<SearchEngineQuery> = [];
	return {
		searches,
		layer: Layer.succeed(SearchEngine, {
			search: (search) =>
				Effect.sync(() => {
					searches.push(search);
					return results;
				}),
		}),
	};
}
