import type { Actor } from "#core/actor/actor";
import type { ReadOnlyActor } from "#core/actor/read-only-actor";
import type { StaffActor } from "#core/actor/staff-actor";
import type { SystemActor } from "#core/actor/system-actor";
import type { UserActor } from "#core/actor/user-actor";

export interface ActorMatcher<A> {
	readonly ReadOnlyActor: (actor: ReadOnlyActor) => A;
	readonly SystemActor: (actor: SystemActor) => A;
	readonly StaffActor: (actor: StaffActor) => A;
	readonly UserActor: (actor: UserActor) => A;
}

export function matchActor<A>(actor: Actor, matcher: ActorMatcher<A>): A {
	switch (actor._tag) {
		case "ReadOnlyActor":
			return matcher.ReadOnlyActor(actor);
		case "SystemActor":
			return matcher.SystemActor(actor);
		case "StaffActor":
			return matcher.StaffActor(actor);
		case "UserActor":
			return matcher.UserActor(actor);
	}
}
