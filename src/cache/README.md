# cache

A string-to-string cache with a time to live per entry. A miss and an outage are typed errors, and what they mean is the caller's decision.

```ts
import { KeyValueCacheService, readCachedValue, writeCachedValue } from "@voila.dev/platform/cache";

const profile = (id: string) =>
	Effect.gen(function* () {
		const cache = yield* KeyValueCacheService;
		const cached = yield* readCachedValue(cache, `profile:${id}`, Profile);
		if (Option.isSome(cached)) return cached.value;
		const fresh = yield* loadProfile(id);
		yield* writeCachedValue(cache, { key: `profile:${id}`, schema: Profile, value: fresh, ttlSeconds: 300 });
		return fresh;
	});
```

- `readCachedValue` and `writeCachedValue` never fail: an outage is logged, an entry that no longer decodes reads as absent.
- `readSingleUseCacheEntry` is for a cache that is the only store of a token: a miss is `None`, an outage dies.
- `increment(key, ttlSeconds)` is an atomic counter for a fixed window.
- `/cache/memory`'s `inMemoryKeyValueCache()` returns `{ store, layer }`; expiry follows the Effect `Clock`. `/cache/redis`'s `redisKeyValueCache({ prefix })` runs on the application's `Redis`.
