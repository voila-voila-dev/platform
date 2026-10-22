import { Effect, Layer } from "effect";
import { SearchEngine } from "#search-engine/services/search-engine";
import { SearchEngineResult } from "#search-engine/value-objects/search-engine-result";

function fnv1a(text: string) {
	let hash = 0x81_1c_9d_c5;
	for (const character of text) {
		hash ^= character.codePointAt(0) ?? 0;
		hash = Math.imul(hash, 0x01_00_01_93);
	}
	return (hash >>> 0).toString(16).padStart(8, "0");
}

// Same query, same synthetic page: local development never calls a metered SERP API.
export const inMemorySearchEngine = Layer.succeed(SearchEngine, {
	search: ({ query, resultCount, locale, country }) =>
		Effect.succeed(
			Array.from({ length: resultCount }, (_, index) => {
				const seed = fnv1a(`${locale}:${country}:${query}:${index}`);
				return SearchEngineResult.make({
					url: `https://search.invalid/${seed}`,
					title: `${query} — result ${index + 1}`,
					description: `Synthetic search result for "${query}" (${seed}).`,
				});
			}),
		),
});
