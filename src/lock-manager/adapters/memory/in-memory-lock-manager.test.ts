import { describe, expect, it } from "bun:test";
import { Effect, Fiber } from "effect";
import { inMemoryLockManager } from "#lock-manager/adapters/memory/in-memory-lock-manager";
import { LockManagerService } from "#lock-manager/services/lock-manager-service";

function run<A, E>(effect: Effect.Effect<A, E, LockManagerService>) {
	return Effect.runPromise(effect.pipe(Effect.provide(inMemoryLockManager)));
}

describe("inMemoryLockManager", () => {
	it("runs the guarded sections of one key one after the other", async () => {
		const events = await run(
			Effect.gen(function* () {
				const locks = yield* LockManagerService;
				const events: Array<string> = [];
				function section(name: string) {
					return locks.withLock(
						"key",
						Effect.sync(() => events.push(`${name} start`)).pipe(
							Effect.andThen(Effect.yieldNow),
							Effect.andThen(Effect.sync(() => events.push(`${name} end`))),
						),
					);
				}
				yield* Effect.all([section("a"), section("b")], {
					concurrency: "unbounded",
				});
				return events;
			}),
		);

		expect(events).toStrictEqual(["a start", "a end", "b start", "b end"]);
	});

	it("does not make another key wait", async () => {
		const ran = await run(
			Effect.gen(function* () {
				const locks = yield* LockManagerService;
				const holder = yield* Effect.forkChild(
					locks.withLock("a", Effect.never),
				);
				yield* Effect.yieldNow;
				const other = yield* locks.withLock("b", Effect.succeed(true));
				yield* Fiber.interrupt(holder);
				return other;
			}),
		);

		expect(ran).toBe(true);
	});

	it("releases the key when the guarded effect fails", async () => {
		const ran = await run(
			Effect.gen(function* () {
				const locks = yield* LockManagerService;
				yield* Effect.flip(locks.withLock("key", Effect.fail("boom")));
				return yield* locks.withLock("key", Effect.succeed(true));
			}),
		);

		expect(ran).toBe(true);
	});
});
