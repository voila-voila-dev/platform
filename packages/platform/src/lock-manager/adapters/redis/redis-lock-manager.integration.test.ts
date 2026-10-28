import { describe, expect, it } from "bun:test";
import { RedisClient } from "bun";
import { Effect, Layer } from "effect";
import { Redis } from "effect/persistence";
import { redisLockManager } from "#lock-manager/adapters/redis/redis-lock-manager";
import { LockManagerService } from "#lock-manager/services/lock-manager-service";

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

describe.skipIf(url === undefined)("redisLockManager", () => {
	function locks() {
		return redisLockManager({
			prefix: `test-${crypto.randomUUID()}:`,
			acquireTimeout: "200 millis",
			retryDelay: "20 millis",
		}).pipe(Layer.provide(bunRedis(url ?? "")));
	}

	it("fails to acquire a key another holder keeps past the timeout", async () => {
		const exit = await Effect.runPromise(
			Effect.exit(
				Effect.gen(function* () {
					const manager = yield* LockManagerService;
					return yield* manager.withLock(
						"key",
						manager.withLock("key", Effect.void),
					);
				}).pipe(Effect.provide(locks())),
			),
		);

		expect(exit._tag).toBe("Failure");
	});

	it("frees the key once the holder is done", async () => {
		const ran = await Effect.runPromise(
			Effect.gen(function* () {
				const manager = yield* LockManagerService;
				yield* manager.withLock("key", Effect.void);
				return yield* manager.withLock("key", Effect.succeed(true));
			}).pipe(Effect.provide(locks())),
		);

		expect(ran).toBe(true);
	});
});
