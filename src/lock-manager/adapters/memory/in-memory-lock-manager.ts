import { Effect, Layer, Semaphore } from "effect";
import { LockManagerService } from "#lock-manager/services/lock-manager-service";

// One semaphore per key ever locked, for one process: a holder waits its turn
// and it never fails with `LockAcquisitionError`.
export const inMemoryLockManager: Layer.Layer<LockManagerService> = Layer.sync(
	LockManagerService,
	() => {
		const semaphores = new Map<string, Semaphore.Semaphore>();
		function semaphoreFor(key: string) {
			const existing = semaphores.get(key);
			if (existing !== undefined) {
				return existing;
			}
			const created = Semaphore.makeUnsafe(1);
			semaphores.set(key, created);
			return created;
		}
		return LockManagerService.of({
			withLock: (key, effect) =>
				Effect.suspend(() => Semaphore.withPermit(semaphoreFor(key))(effect)),
		});
	},
);
