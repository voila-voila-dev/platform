import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { inMemorySearchEngine } from "#search-engine/adapters/memory/in-memory-search-engine";
import { SearchEngine } from "#search-engine/services/search-engine";

function search(query: string, resultCount: number) {
	return Effect.runPromise(
		SearchEngine.use((engine) => engine.search({ query, resultCount })).pipe(
			Effect.provide(inMemorySearchEngine),
		),
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
});
