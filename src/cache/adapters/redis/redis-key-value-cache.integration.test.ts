import { describe, expect, it } from "bun:test";
import { RedisClient } from "bun";
import { Effect, Layer } from "effect";
import { Redis } from "effect/persistence";
import { redisKeyValueCache } from "#cache/adapters/redis/redis-key-value-cache";
import { KeyValueCache } from "#cache/services/key-value-cache";

const url = process.env.REDIS_URL;

function bunRedis(redisUrl: string) {
	return Layer.effect(
		Redis.Redis,
		Effect.gen(function* () {
			const client = yield* Effect.acquireRelease(
				Effect.sync(() => new RedisClient(redisUrl)),
				(opened) => Effect.sync(() => opened.close()),
			);
			return yield* Redis.make({
				send: (command, ...args) =>
					Effect.tryPromise({
						try: () => client.send(command, [...args]),
						catch: (cause) => new Redis.RedisError({ cause }),
					}),
				subscribe: () => Effect.die("unused"),
			});
		}),
	);
}

describe.skipIf(url === undefined)("redisKeyValueCache", () => {
	function run<A, E>(effect: Effect.Effect<A, E, KeyValueCache>) {
		const prefix = `test-${crypto.randomUUID()}:`;
		return Effect.runPromise(
			effect.pipe(
				Effect.provide(
					redisKeyValueCache({ prefix }).pipe(
						Layer.provide(bunRedis(url ?? "")),
					),
				),
			),
		);
	}

	it("reads back a value, then misses it once deleted", async () => {
		const reads = await run(
			Effect.gen(function* () {
				const cache = yield* KeyValueCache;
				yield* cache.set("key", "value", 60);
				const stored = yield* cache.get("key");
				yield* cache.delete("key");
				const deleted = yield* Effect.flip(cache.get("key"));
				return [stored, deleted._tag];
			}),
		);

		expect(reads).toStrictEqual(["value", "CacheMissError"]);
	});

	it("counts atomically", async () => {
		const totals = await run(
			KeyValueCache.use((cache) =>
				Effect.all(
					Array.from({ length: 5 }, () => cache.increment("counter", 60)),
					{ concurrency: "unbounded" },
				),
			),
		);

		expect([...totals].sort()).toStrictEqual([1, 2, 3, 4, 5]);
	});
});
