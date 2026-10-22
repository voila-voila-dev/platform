---
"@voila.dev/platform": minor
---

Add the `cache` brick: `KeyValueCache` (string values with a time to live, an atomic `increment`, typed `CacheMissError` and `CacheTransportError`), `readCachedValue` and `writeCachedValue` for a cache in front of a source of truth, `readSingleUseCacheEntry` for a cache that is the token store, with `/cache/memory` (`inMemoryKeyValueCache`, on the Effect `Clock`) and `/cache/redis` (`redisKeyValueCache`, on the application's `Redis`).
