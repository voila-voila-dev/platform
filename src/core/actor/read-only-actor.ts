import { Schema } from "effect";

export class ReadOnlyActor extends Schema.TaggedClass<ReadOnlyActor>()(
	"ReadOnlyActor",
	{},
) {}
