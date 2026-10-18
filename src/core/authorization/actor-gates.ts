import { Effect } from "effect";
import type { Actor } from "#core/actor/actor";
import { matchActor } from "#core/actor/match-actor";
import { AccessDeniedError } from "#core/authorization/access-denied-error";
import {
	type PermissionRef,
	permissionRef,
} from "#core/authorization/permission-ref";
import { checked } from "#core/authorization/permission-tracing";
import type { UserId } from "#core/value-objects/user-id";

const allow: Effect.Effect<void, AccessDeniedError> = Effect.void;
const deny: Effect.Effect<void, AccessDeniedError> = Effect.fail(
	new AccessDeniedError(),
);

function actorRef(name: string): PermissionRef {
	return permissionRef("actor", name);
}

export function allowAnyActor(
	_actor: Actor,
): Effect.Effect<void, AccessDeniedError> {
	return checked([actorRef("anyone")])(allow);
}

export function requireAuthenticatedActor(
	actor: Actor,
): Effect.Effect<void, AccessDeniedError> {
	return checked([actorRef("authenticated")])(
		matchActor(actor, {
			ReadOnlyActor: () => deny,
			SystemActor: () => allow,
			StaffActor: () => allow,
			UserActor: () => allow,
		}),
	);
}

export function requireStaffActor(
	actor: Actor,
): Effect.Effect<void, AccessDeniedError> {
	return checked([actorRef("staff")])(
		matchActor(actor, {
			ReadOnlyActor: () => deny,
			SystemActor: () => allow,
			StaffActor: () => allow,
			UserActor: () => deny,
		}),
	);
}

export function requireSystemActor(
	actor: Actor,
): Effect.Effect<void, AccessDeniedError> {
	return checked([actorRef("system")])(
		matchActor(actor, {
			ReadOnlyActor: () => deny,
			SystemActor: () => allow,
			StaffActor: () => deny,
			UserActor: () => deny,
		}),
	);
}

export function requireSelfUserActor(
	actor: Actor,
	userId: UserId,
): Effect.Effect<void, AccessDeniedError> {
	return checked([actorRef("self")])(
		matchActor(actor, {
			ReadOnlyActor: () => deny,
			SystemActor: () => allow,
			StaffActor: () => allow,
			UserActor: (user) => (user.userId === userId ? allow : deny),
		}),
	);
}
