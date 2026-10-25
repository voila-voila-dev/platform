import { Context, type Effect } from "effect";
import type { LockAcquisitionError } from "#lock-manager/errors/lock-acquisition-error";

// A distributed lock is lease-based: a crashed holder stops blocking others
// once its lease runs out, but a guarded effect that outlives its lease loses
// exclusivity. Keep guarded sections short, like a read-modify-write.
export class LockManagerService extends Context.Service<
	LockManagerService,
	{
		readonly withLock: <A, E, R>(
			key: string,
			effect: Effect.Effect<A, E, R>,
		) => Effect.Effect<A, E | LockAcquisitionError, R>;
	}
>()("@voila.dev/platform/LockManagerService") {}
