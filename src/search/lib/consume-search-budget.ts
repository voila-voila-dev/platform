import { Effect } from "effect";
import type { Actor } from "#core/actor/actor";
import type { RateLimitedError } from "#rate-limiting/errors/rate-limited-error";
import { actorRateLimitKey } from "#rate-limiting/lib/actor-rate-limit-key";
import { RateLimiter } from "#rate-limiting/services/rate-limiter";

const MINUTE_SECONDS = 60;
const MAX_PER_CALLER_PER_MINUTE = 60;
const MAX_GLOBAL_PER_MINUTE = 600;

export function consumeSearchBudget(
	surface: string,
	actor: Actor,
	ipAddress: string | null = null,
): Effect.Effect<void, RateLimitedError, RateLimiter> {
	return Effect.gen(function* () {
		const rateLimiter = yield* RateLimiter;
		const caller = ipAddress ?? actorRateLimitKey(actor);

		yield* rateLimiter.consumeMany(
			`search:${surface}:caller:${caller}`,
			MINUTE_SECONDS,
			MAX_PER_CALLER_PER_MINUTE,
		);
		yield* rateLimiter.consumeMany(
			`search:${surface}:global`,
			MINUTE_SECONDS,
			MAX_GLOBAL_PER_MINUTE,
		);
	});
}
