import type { Effect } from "effect";
import type { AccessDeniedError } from "#core/authorization/access-denied-error";
import type { PermissionRef } from "#core/authorization/permission-ref";

export interface Gate<
	in I,
	out E extends AccessDeniedError = AccessDeniedError,
> {
	readonly label: string;
	readonly permissions: ReadonlyArray<PermissionRef>;
	readonly check: (input: I) => Effect.Effect<void, E>;
}

export type OpenGate<I> = Gate<I, never>;
