import { Clock, Duration, Effect, Layer } from "effect";
import { Redis } from "effect/persistence";
import { LockAcquisitionError } from "#lock-manager/errors/lock-acquisition-error";
import { LockManagerService } from "#lock-manager/services/lock-manager-service";

// Unpredictable, not merely unique, so no other process can release a lock
// it does not hold.
function ownerToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(16));
	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
		"",
	);
}

// A holder whose lease ran out must not delete the next holder's lock.
const releaseScript = Redis.script(
	(key: string, token: string) => [key, token],
	{
		numberOfKeys: 1,
		lua: `if redis.call("GET", KEYS[1]) == ARGV[1] then return redis.call("DEL", KEYS[1]) else return 0 end`,
	},
).withReturnType<number>();

// On the application's `Redis` (e.g. `BunRedis.layer` from
// @effect/platform-bun). Every instance that contends on a key must use the
// same prefix and lease.
export function redisLockManager(
	options: {
		readonly prefix?: string;
		readonly lease?: Duration.Input;
		readonly acquireTimeout?: Duration.Input;
		readonly retryDelay?: Duration.Input;
	} = {},
): Layer.Layer<LockManagerService, never, Redis.Redis> {
	const prefix = options.prefix ?? "lock:";
	const leaseMillis = String(Duration.toMillis(options.lease ?? "30 seconds"));
	const acquireTimeoutMillis = Duration.toMillis(
		options.acquireTimeout ?? "10 seconds",
	);
	const retryDelay = options.retryDelay ?? "100 millis";

	return Layer.effect(
		LockManagerService,
		Redis.Redis.useSync((redis) => {
			const release = redis.eval(releaseScript);

			function acquire(key: string, storageKey: string, token: string) {
				return Effect.gen(function* () {
					const startMillis = yield* Clock.currentTimeMillis;
					while (true) {
						const reply = yield* redis
							.send<string | null>(
								"SET",
								storageKey,
								token,
								"NX",
								"PX",
								leaseMillis,
							)
							.pipe(
								Effect.mapError(
									(error) =>
										new LockAcquisitionError({
											key,
											reason: `acquire failed: ${error.cause}`,
										}),
								),
							);
						if (reply === "OK") {
							return;
						}
						if (
							(yield* Clock.currentTimeMillis) - startMillis >=
							acquireTimeoutMillis
						) {
							return yield* new LockAcquisitionError({
								key,
								reason: `still held after ${acquireTimeoutMillis}ms`,
							});
						}
						yield* Effect.sleep(retryDelay);
					}
				});
			}

			return LockManagerService.of({
				withLock: (key, effect) =>
					Effect.suspend(() => {
						const storageKey = `${prefix}${key}`;
						const token = ownerToken();
						// Masked so an interruption between the acquire and the guarded
						// effect still releases. A failed release is ignored: the lease
						// frees the key.
						return Effect.uninterruptibleMask((restore) =>
							restore(acquire(key, storageKey, token)).pipe(
								Effect.andThen(
									restore(effect).pipe(
										Effect.ensuring(Effect.ignore(release(storageKey, token))),
									),
								),
							),
						);
					}),
			});
		}),
	);
}
