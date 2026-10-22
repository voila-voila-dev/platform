import { Context, type Effect } from "effect";
import type { SearchEngineError } from "#search-engine/errors/search-engine-error";
import type { SearchEngineResult } from "#search-engine/value-objects/search-engine-result";

export class SearchEngine extends Context.Service<
	SearchEngine,
	{
		readonly search: (params: {
			readonly query: string;
			readonly resultCount: number;
		}) => Effect.Effect<ReadonlyArray<SearchEngineResult>, SearchEngineError>;
	}
>()("@voila.dev/platform/SearchEngine") {}
