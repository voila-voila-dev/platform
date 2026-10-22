import { Effect, Layer } from "effect";
import { Redis } from "effect/persistence";
import { CacheMissError } from "#cache/errors/cache-miss-error";
import { CacheTransportError } from "#cache/errors/cache-transport-error";
import { KeyValueCache } from "#cache/services/key-value-cache";

// INCR creates the key without a TTL, so only the first increment of a window
// sets one, or a busy window would push its own expiry out. One script keeps
// both steps atomic: a crash between them would leave a counter forever.
const incrementScript = Redis.script(
	(key: string, ttlSeconds: number) => [key, ttlSeconds],
	{
		numberOfKeys: 1,
		lua: `local total = redis.call("INCR", KEYS[1])
if total == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end
return total`,
	},
).withReturnType<number>();

// On the application's `Redis` (e.g. `BunRedis.layer` from
// @effect/platform-bun). Give environments that share a server their own
// prefix.
export function redisKeyValueCache(
	options: { readonly prefix?: string } = {},
): Layer.Layer<KeyValueCache, never, Redis.Redis> {
	const prefix = options.prefix ?? "cache:";
	return Layer.effect(
		KeyValueCache,
		Redis.Redis.useSync((redis) => {
			const increment = redis.eval(incrementScript);
			function transport(key: string, verb: string) {
				return (error: Redis.RedisError) =>
					new CacheTransportError({
						key,
						reason: `${verb} failed: ${error.cause}`,
					});
			}
			return KeyValueCache.of({
				get: (key) =>
					redis.send<string | null>("GET", `${prefix}${key}`).pipe(
						Effect.mapError(transport(key, "get")),
						Effect.flatMap((value) =>
							value === null
								? Effect.fail(new CacheMissError({ key }))
								: Effect.succeed(value),
						),
					),
				set: (key, value, ttlSeconds) =>
					redis
						.send("SET", `${prefix}${key}`, value, "EX", String(ttlSeconds))
						.pipe(Effect.mapError(transport(key, "set")), Effect.asVoid),
				increment: (key, ttlSeconds) =>
					increment(`${prefix}${key}`, ttlSeconds).pipe(
						Effect.mapError(transport(key, "increment")),
					),
				delete: (key) =>
					redis
						.send("DEL", `${prefix}${key}`)
						.pipe(Effect.mapError(transport(key, "delete")), Effect.asVoid),
			});
		}),
	);
}
