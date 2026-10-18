import { Schema } from "effect";
import { UserId } from "#core/ids/user-id";

export class UserActor extends Schema.TaggedClass<UserActor>()("UserActor", {
	userId: UserId,
}) {}
