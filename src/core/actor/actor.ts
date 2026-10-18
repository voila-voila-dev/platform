import { Schema } from "effect";
import { ReadOnlyActor } from "#core/actor/read-only-actor";
import { StaffActor } from "#core/actor/staff-actor";
import { SystemActor } from "#core/actor/system-actor";
import { UserActor } from "#core/actor/user-actor";

export const Actor = Schema.Union([
	ReadOnlyActor,
	SystemActor,
	StaffActor,
	UserActor,
]);

export type Actor = typeof Actor.Type;

export const isActor = Schema.is(Actor);
