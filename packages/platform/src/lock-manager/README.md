# lock-manager

Mutual exclusion per key, across every instance of the application.

```ts
import { LockManagerService } from "@voila.dev/platform/lock-manager";

const next = Effect.gen(function* () {
	const locks = yield* LockManagerService;
	return yield* locks.withLock("sequence:orders", takeNextNumber);
});
```

- The lock is released when the effect ends, however it ends.
- `LockAcquisitionError` means the guarded effect never ran, so retrying is safe.
- `/lock-manager/redis`'s `redisLockManager({ prefix, lease, acquireTimeout, retryDelay })` is lease-based (30 seconds by default): a crashed holder blocks its key for one lease at most, and a holder never releases a lock someone else took over. Keep guarded sections shorter than the lease. It waits up to `acquireTimeout` (10 seconds by default) for a held key.
- `/lock-manager/memory`'s `inMemoryLockManager` is for one process: a holder waits its turn, with no timeout.
