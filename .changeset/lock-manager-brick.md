---
"@voila.dev/platform": minor
---

Add the `lock-manager` brick: `LockManagerService.withLock(key, effect)` runs the effect while holding the key and releases it however it ends, failing with `LockAcquisitionError` when the key cannot be taken. `/lock-manager/memory` has `inMemoryLockManager` (one semaphore per key). `/lock-manager/redis` has `redisLockManager({ prefix, lease, acquireTimeout, retryDelay })`: `SET NX PX` to acquire and a compare-and-delete script to release, on the application's `Redis`.
