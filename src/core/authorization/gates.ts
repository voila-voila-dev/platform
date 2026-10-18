import type { Effect } from "effect";
import type { Actor } from "#core/actor/actor";
import type { AccessDeniedError } from "#core/authorization/access-denied-error";
import {
	requireAuthenticatedActor,
	requireSelfUserActor,
	requireStaffActor,
	requireSystemActor,
} from "#core/authorization/actor-gates";
import type { Gate as GateType } from "#core/authorization/gate";
import { all, either } from "#core/authorization/gate-combinators";
import {
	anyone,
	bearer,
	gateWhen,
	makeGate,
} from "#core/authorization/gate-constructors";
import { permissionRef } from "#core/authorization/permission-ref";
import type { UserId } from "#core/value-objects/user-id";

export interface WithActor {
	readonly actor: Actor;
}

function fenceGate<I>(
	name: string,
	check: (input: I) => Effect.Effect<void, AccessDeniedError>,
): GateType<I> {
	return { label: name, permissions: [permissionRef("actor", name)], check };
}

export const Gate = {
	make: makeGate,
	when: gateWhen,
	anyone,
	bearer,
	either,
	all,
	authenticated: <I extends WithActor>(): GateType<I> =>
		fenceGate("authenticated", ({ actor }) => requireAuthenticatedActor(actor)),
	staff: <I extends WithActor>(): GateType<I> =>
		fenceGate("staff", ({ actor }) => requireStaffActor(actor)),
	system: <I extends WithActor>(): GateType<I> =>
		fenceGate("system", ({ actor }) => requireSystemActor(actor)),
	self: <
		I extends WithActor & { payload: { userId: UserId } },
	>(): GateType<I> =>
		fenceGate("self", ({ actor, payload }) =>
			requireSelfUserActor(actor, payload.userId),
		),
} as const;
