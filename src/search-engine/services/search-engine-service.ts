import { Context, type Effect } from "effect";
import type { Locale } from "#locale/value-objects/locale";
import type { CountryCode } from "#location/value-objects/country-code";
import type { SearchEngineError } from "#search-engine/errors/search-engine-error";
import type { SearchEngineResult } from "#search-engine/value-objects/search-engine-result";

export interface SearchEngineQuery {
	readonly query: string;
	readonly resultCount: number;
	/** The language of the results; the locale's region does not move the search. */
	readonly locale: Locale;
	/** Where the search runs from: the same query gives another page elsewhere. */
	readonly country: CountryCode;
}

export class SearchEngineService extends Context.Service<
	SearchEngineService,
	{
		readonly search: (
			query: SearchEngineQuery,
		) => Effect.Effect<ReadonlyArray<SearchEngineResult>, SearchEngineError>;
	}
>()("@voila.dev/platform/SearchEngineService") {}
