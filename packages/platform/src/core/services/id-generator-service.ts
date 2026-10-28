import { Context, type Effect } from "effect";
import type { Id } from "#core/value-objects/id";

export class IdGeneratorService extends Context.Service<
	IdGeneratorService,
	{
		readonly generate: () => Effect.Effect<Id>;
	}
>()("@voila.dev/platform/IdGeneratorService") {}
