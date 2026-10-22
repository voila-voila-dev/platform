import { describe, expect, it } from "bun:test";
import { Effect, Layer, Option, Schema } from "effect";
import { inMemoryKeyValueCache } from "#cache/adapters/memory/in-memory-key-value-cache";
import { CacheTransportError } from "#cache/errors/cache-transport-error";
import { readCachedValue } from "#cache/lib/read-cached-value";
import { writeCachedValue } from "#cache/lib/write-cached-value";
import { KeyValueCache } from "#cache/services/key-value-cache";

const Profile = Schema.Struct({ name: Schema.String });

const unreachable = Layer.succeed(KeyValueCache, {
	get: (key) => Effect.fail(new CacheTransportError({ key, reason: "down" })),
	set: (key) => Effect.fail(new CacheTransportError({ key, reason: "down" })),
	increment: (key) =>
		Effect.fail(new CacheTransportError({ key, reason: "down" })),
	delete: (key) =>
		Effect.fail(new CacheTransportError({ key, reason: "down" })),
});

function run<A>(
	effect: Effect.Effect<A, never, KeyValueCache>,
	layer: Layer.Layer<KeyValueCache>,
) {
	return Effect.runPromise(effect.pipe(Effect.provide(layer)));
}

describe("readCachedValue and writeCachedValue", () => {
	it("read back what was written", async () => {
		const read = await run(
			KeyValueCache.use((cache) =>
				writeCachedValue(cache, {
					key: "profile",
					schema: Profile,
					value: { name: "Ada" },
					ttlSeconds: 60,
				}).pipe(Effect.andThen(readCachedValue(cache, "profile", Profile))),
			),
			inMemoryKeyValueCache().layer,
		);

		expect(read).toStrictEqual(Option.some({ name: "Ada" }));
	});

	it("read an entry that no longer decodes as absent", async () => {
		const cache = inMemoryKeyValueCache();
		cache.store.set("profile", JSON.stringify({ fullName: "Ada" }));

		const read = await run(
			KeyValueCache.use((kv) => readCachedValue(kv, "profile", Profile)),
			cache.layer,
		);

		expect(read).toStrictEqual(Option.none());
	});

	it("never fail when the cache is unreachable", async () => {
		const read = await run(
			KeyValueCache.use((cache) =>
				writeCachedValue(cache, {
					key: "profile",
					schema: Profile,
					value: { name: "Ada" },
					ttlSeconds: 60,
				}).pipe(Effect.andThen(readCachedValue(cache, "profile", Profile))),
			),
			unreachable,
		);

		expect(read).toStrictEqual(Option.none());
	});
});
