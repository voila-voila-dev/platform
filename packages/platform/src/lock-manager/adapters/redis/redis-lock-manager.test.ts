import { describe, expect, it } from "bun:test";
import { Effect, Layer } from "effect";
import { Redis } from "effect/persistence";
import { redisLockManager } from "#lock-manager/adapters/redis/redis-lock-manager";
import { LockManagerService } from "#lock-manager/services/lock-manager-service";

function recordingRedis() {
	const commands: Array<ReadonlyArray<string>> = [];
	const store = new Map<string, string>();
	const layer = Layer.effect(
		Redis.Redis,
		Redis.make({
			send: (command, ...args) =>
				Effect.sync(() => {
					const strings = args.map(String);
					commands.push([command, ...strings]);
					const [key = "", value = ""] = strings;
					if (command === "SCRIPT") return "release-sha";
					if (command === "SET") {
						if (store.has(key)) return null;
						store.set(key, value);
						return "OK";
					}
					const [, , storageKey = "", token = ""] = strings;
					if (store.get(storageKey) !== token) return 0;
					store.delete(storageKey);
					return 1;
				}) as never,
			subscribe: () => Effect.die("unused"),
		}),
	);
	return { commands, store, layer };
}

// Instances from two deploys contend on the same keys, so the commands are
// part of the contract.
describe("redisLockManager", () => {
	it("acquires with SET NX PX and releases by token", async () => {
		const redis = recordingRedis();
		let heldDuringEffect = false;

		await Effect.runPromise(
			LockManagerService.use((locks) =>
				locks.withLock(
					"invoice-series:FR",
					Effect.sync(() => {
						heldDuringEffect = redis.store.has("app:lock:invoice-series:FR");
					}),
				),
			).pipe(
				Effect.provide(
					redisLockManager({ prefix: "app:lock:" }).pipe(
						Layer.provide(redis.layer),
					),
				),
			),
		);

		const [acquire = []] = redis.commands;
		const [, , token = ""] = acquire;
		expect(heldDuringEffect).toBe(true);
		expect(redis.store.size).toBe(0);
		expect(acquire).toStrictEqual([
			"SET",
			"app:lock:invoice-series:FR",
			expect.stringMatching(/^[0-9a-f]{32}$/),
			"NX",
			"PX",
			"30000",
		]);
		expect(redis.commands.at(-1)).toStrictEqual([
			"EVALSHA",
			"release-sha",
			"1",
			"app:lock:invoice-series:FR",
			token,
		]);
	});
});
