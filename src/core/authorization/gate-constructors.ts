import { Effect } from "effect";
import { AccessDeniedError } from "#core/authorization/access-denied-error";
import type { Gate, OpenGate } from "#core/authorization/gate";
import {
	type PermissionRef,
	permissionRef,
} from "#core/authorization/permission-ref";
import { checked } from "#core/authorization/permission-tracing";

export function makeGate<
	I,
	E extends AccessDeniedError = AccessDeniedError,
>(options: {
	readonly label: string;
	readonly permissions: ReadonlyArray<PermissionRef>;
	readonly check: (input: I) => Effect.Effect<void, E>;
}): Gate<I, E> {
	return {
		label: options.label,
		permissions: options.permissions,
		check: (input) => checked(options.permissions)(options.check(input)),
	};
}

export function gateWhen<I>(options: {
	readonly label: string;
	readonly permissions: ReadonlyArray<PermissionRef>;
	readonly allows: (input: I) => boolean;
}): Gate<I> {
	return makeGate({
		label: options.label,
		permissions: options.permissions,
		check: (input) =>
			options.allows(input)
				? Effect.void
				: Effect.fail(new AccessDeniedError()),
	});
}

const ANYONE = [permissionRef("actor", "anyone")];

function openGate<I>(label: string): OpenGate<I> {
	return makeGate<I, never>({
		label,
		permissions: ANYONE,
		check: () => Effect.void,
	});
}

export function anyone<I>(): OpenGate<I> {
	return openGate("anyone");
}

export function bearer<I>(credential: string): OpenGate<I> {
	return openGate(`bearer of ${credential}`);
}
