import { Schema } from "effect";
import { UserId } from "#core/value-objects/user-id";

export class StaffActor extends Schema.TaggedClass<StaffActor>()("StaffActor", {
	userId: UserId,
}) {}
