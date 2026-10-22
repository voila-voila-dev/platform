import { describe, expect, it } from "bun:test";
import { Effect, Layer } from "effect";
import { TestClock } from "effect/testing";
import { inMemoryKeyValueCache } from "#cache/adapters/memory/in-memory-key-value-cache";
import { KeyValueCache } from "#cache/services/key-value-cache";

function run<A, E>(effect: Effect.Effect<A, E, KeyValueCache>) {
	return Effect.runPromise(
		effect.pipe(
			Effect.provide(
				Layer.merge(inMemoryKeyValueCache().layer, TestClock.layer()),
			),
		),
	);
}

describe("inMemoryKeyValueCache", () => {
	it("reads back a value until its time to live runs out", async () => {
		const reads = await run(
			Effect.gen(function* () {
				const cache = yield* KeyValueCache;
				yield* cache.set("key", "value", 60);
				const fresh = yield* cache.get("key");
				yield* TestClock.adjust("60 seconds");
				const expired = yield* Effect.flip(cache.get("key"));
				return [fresh, expired._tag];
			}),
		);

		expect(reads).toStrictEqual(["value", "CacheMissError"]);
	});

	it("keeps a counter's first expiry", async () => {
		const totals = await run(
			Effect.gen(function* () {
				const cache = yield* KeyValueCache;
				const first = yield* cache.increment("counter", 60);
				yield* TestClock.adjust("30 seconds");
				const second = yield* cache.increment("counter", 60);
				yield* TestClock.adjust("30 seconds");
				const reset = yield* cache.increment("counter", 60);
				return [first, second, reset];
			}),
		);

		expect(totals).toStrictEqual([1, 2, 1]);
	});

	it("misses a deleted key", async () => {
		const cache = inMemoryKeyValueCache();
		cache.store.set("key", "seeded");

		const exit = await Effect.runPromise(
			Effect.exit(
				KeyValueCache.use((kv) =>
					Effect.andThen(kv.delete("key"), kv.get("key")),
				).pipe(Effect.provide(cache.layer)),
			),
		);

		expect(exit._tag).toBe("Failure");
		expect(cache.store.has("key")).toBe(false);
	});
});
