import { describe, expect, it } from "bun:test";
import { Effect, Exit, Layer, Option } from "effect";
import { inMemoryKeyValueCache } from "#cache/adapters/memory/in-memory-key-value-cache";
import { CacheTransportError } from "#cache/errors/cache-transport-error";
import { readSingleUseCacheEntry } from "#cache/lib/read-single-use-cache-entry";
import { KeyValueCache } from "#cache/services/key-value-cache";

function read(layer: Layer.Layer<KeyValueCache>) {
	return Effect.runPromise(
		Effect.exit(
			KeyValueCache.use((cache) =>
				readSingleUseCacheEntry(cache, "token"),
			).pipe(Effect.provide(layer)),
		),
	);
}

describe("readSingleUseCacheEntry", () => {
	it("reads a stored entry", async () => {
		const cache = inMemoryKeyValueCache();
		cache.store.set("token", "value");

		expect(await read(cache.layer)).toStrictEqual(
			Exit.succeed(Option.some("value")),
		);
	});

	it("reads a missing entry as none", async () => {
		expect(await read(inMemoryKeyValueCache().layer)).toStrictEqual(
			Exit.succeed(Option.none()),
		);
	});

	it("dies when the cache is unreachable", async () => {
		const exit = await read(
			Layer.succeed(KeyValueCache, {
				get: (key) =>
					Effect.fail(new CacheTransportError({ key, reason: "down" })),
				set: () => Effect.void,
				increment: () => Effect.succeed(0),
				delete: () => Effect.void,
			}),
		);

		expect(Exit.hasDies(exit)).toBe(true);
	});
});
