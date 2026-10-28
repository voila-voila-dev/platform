import { describe, expect, it } from "bun:test";
import { RedisClient } from "bun";
import { Effect, Layer } from "effect";
import { Redis } from "effect/persistence";
import { redisRateLimiter } from "#rate-limiting/adapters/redis/redis-rate-limiter";
import { RateLimiterService } from "#rate-limiting/services/rate-limiter-service";

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

describe.skipIf(url === undefined)("redisRateLimiter", () => {
	it("shares one count per key across limiters on the same server", async () => {
		const prefix = `test-${crypto.randomUUID()}:`;
		function limiter() {
			return redisRateLimiter({ prefix }).pipe(
				Layer.provide(bunRedis(url ?? "")),
			);
		}
		function consume() {
			return Effect.runPromise(
				Effect.exit(
					Effect.flatMap(RateLimiterService, (rateLimiter) =>
						rateLimiter.consumeMany("key", 60, 2),
					).pipe(Effect.provide(limiter())),
				),
			);
		}

		const results = [await consume(), await consume(), await consume()];

		expect(results.map((exit) => exit._tag)).toStrictEqual([
			"Success",
			"Success",
			"Failure",
		]);
	});
});
