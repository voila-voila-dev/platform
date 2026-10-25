import { Effect, Option } from "effect";
import type { KeyValueCacheService } from "#cache/services/key-value-cache-service";

// For a cache that is the token store: a miss is an unknown, consumed or
// expired token, but an outage dies, so it never makes a valid token look
// invalid.
export function readSingleUseCacheEntry(
	cache: KeyValueCacheService["Service"],
	key: string,
): Effect.Effect<Option.Option<string>> {
	return cache.get(key).pipe(
		Effect.map(Option.some),
		Effect.catchTag("CacheMissError", () =>
			Effect.succeed(Option.none<string>()),
		),
		Effect.catchTag("CacheTransportError", (error) => Effect.die(error)),
	);
}
