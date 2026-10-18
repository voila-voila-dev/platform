import { Schema } from "effect";
import { UserId } from "#core/value-objects/user-id";

export class UserActor extends Schema.TaggedClass<UserActor>()("UserActor", {
	userId: UserId,
}) {}
