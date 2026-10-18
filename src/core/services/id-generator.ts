import { Context, type Effect } from "effect";
import type { Id } from "#core/value-objects/id";

export class IdGenerator extends Context.Service<
	IdGenerator,
	{
		readonly generate: () => Effect.Effect<Id>;
	}
>()("@voila.dev/platform/IdGenerator") {}
