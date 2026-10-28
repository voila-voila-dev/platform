import { Context, type Effect } from "effect";
import type { CacheMissError } from "#cache/errors/cache-miss-error";
import type { CacheTransportError } from "#cache/errors/cache-transport-error";

// Never best-effort: a cache in front of a database and a cache that is the
// only store of a one-time token want opposite answers to a miss or an
// outage, so the caller decides.
export class KeyValueCacheService extends Context.Service<
	KeyValueCacheService,
	{
		readonly get: (
			key: string,
		) => Effect.Effect<string, CacheMissError | CacheTransportError>;
		readonly set: (
			key: string,
			value: string,
			ttlSeconds: number,
		) => Effect.Effect<void, CacheTransportError>;
		// Atomic; later increments keep the first expiry, so a busy window still
		// resets.
		readonly increment: (
			key: string,
			ttlSeconds: number,
		) => Effect.Effect<number, CacheTransportError>;
		readonly delete: (key: string) => Effect.Effect<void, CacheTransportError>;
	}
>()("@voila.dev/platform/KeyValueCacheService") {}
