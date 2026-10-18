import { Predicate } from "effect";
import { isActor } from "#core/actor/actor";
import { matchActor } from "#core/actor/match-actor";

export type SpanAttributes = Readonly<
	Record<string, string | number | boolean>
>;

export function identityAttributes(
	input: Readonly<Record<string, unknown>>,
): SpanAttributes {
	const actor = input.actor;
	const actorKind = isActor(actor) ? actor._tag : "none";
	const userId = isActor(actor)
		? matchActor<string | undefined>(actor, {
				ReadOnlyActor: () => undefined,
				SystemActor: () => undefined,
				StaffActor: (staff) => staff.userId,
				UserActor: (user) => user.userId,
			})
		: undefined;
	const organizationId = Predicate.hasProperty(input.payload, "organizationId")
		? input.payload.organizationId
		: undefined;
	return {
		"actor.kind": actorKind,
		...(userId === undefined ? {} : { "user.id": userId }),
		...(typeof organizationId === "string"
			? { "organization.id": organizationId }
			: {}),
	};
}
