import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import type { CountryCode } from "#location/value-objects/country-code";
import { inMemorySearchEngine } from "#search-engine/adapters/memory/in-memory-search-engine";
import { SearchEngineService } from "#search-engine/services/search-engine-service";

function search(
	query: string,
	resultCount: number,
	country: CountryCode = "FR",
) {
	return Effect.runPromise(
		SearchEngineService.use((engine) =>
			engine.search({ query, resultCount, locale: "fr-FR", country }),
		).pipe(Effect.provide(inMemorySearchEngine)),
	);
}

describe("inMemorySearchEngine", () => {
	it("returns exactly resultCount results", async () => {
		expect(await search("some club", 3)).toHaveLength(3);
	});

	it("returns the same results for the same query", async () => {
		expect(await search("same club", 2)).toEqual(await search("same club", 2));
	});

	it("returns different results for different queries", async () => {
		expect(await search("club a", 1)).not.toEqual(await search("club b", 1));
	});

	it("returns different results from another country", async () => {
		expect(await search("club", 1, "BE")).not.toEqual(await search("club", 1));
	});
});
