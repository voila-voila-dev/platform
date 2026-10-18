import { Context } from "effect";
import type { Actor } from "#core/actor/actor";

// Provided by the application's authentication middleware.
export class CurrentActor extends Context.Service<CurrentActor, Actor>()(
	"@voila.dev/platform/CurrentActor",
) {}
