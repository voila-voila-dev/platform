import { Schema } from "effect";

export class SystemActor extends Schema.TaggedClass<SystemActor>()(
	"SystemActor",
	{},
) {}
