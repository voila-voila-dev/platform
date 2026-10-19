import { Effect } from "effect";
import type { Actor } from "#core/actor/actor";
import type { RateLimitedError } from "#rate-limiting/errors/rate-limited-error";
import { actorRateLimitKey } from "#rate-limiting/lib/actor-rate-limit-key";
import { RateLimiter } from "#rate-limiting/services/rate-limiter";
import { SearchBudget } from "#search/services/search-budget";

export function consumeSearchBudget(
	surface: string,
	actor: Actor,
	ipAddress: string | null = null,
): Effect.Effect<void, RateLimitedError, RateLimiter> {
	return Effect.gen(function* () {
		const rateLimiter = yield* RateLimiter;
		const budget = yield* SearchBudget;
		const caller = ipAddress ?? actorRateLimitKey(actor);

		yield* rateLimiter.consumeMany(
			`search:${surface}:caller:${caller}`,
			budget.windowSeconds,
			budget.perCaller,
		);
		yield* rateLimiter.consumeMany(
			`search:${surface}:global`,
			budget.windowSeconds,
			budget.global,
		);
	});
}
