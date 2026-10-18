import type { Actor } from "#core/actor/actor";
import { matchActor } from "#core/actor/match-actor";

export function actorRateLimitKey(actor: Actor): string {
	return matchActor(actor, {
		ReadOnlyActor: () => "read-only",
		SystemActor: () => "system",
		StaffActor: (staff) => staff.userId,
		UserActor: (user) => user.userId,
	});
}
