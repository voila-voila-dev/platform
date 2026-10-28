import { Effect, Layer } from "effect";
import {
	type SearchEngineQuery,
	SearchEngineService,
} from "#search-engine/services/search-engine-service";
import type { SearchEngineResult } from "#search-engine/value-objects/search-engine-result";

export function stubSearchEngine(
	results: ReadonlyArray<SearchEngineResult> = [],
) {
	const searches: Array<SearchEngineQuery> = [];
	return {
		searches,
		layer: Layer.succeed(SearchEngineService, {
			search: (search) =>
				Effect.sync(() => {
					searches.push(search);
					return results;
				}),
		}),
	};
}
