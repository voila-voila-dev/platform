import { Effect } from "effect";
import type { Actor } from "#core/actor/actor";
import type { RateLimitedError } from "#rate-limiting/errors/rate-limited-error";
import { actorRateLimitKey } from "#rate-limiting/lib/actor-rate-limit-key";
import { RateLimiterService } from "#rate-limiting/services/rate-limiter-service";
import { SearchBudget } from "#search/services/search-budget";

export function consumeSearchBudget(
	surface: string,
	actor: Actor,
	ipAddress: string | null = null,
): Effect.Effect<void, RateLimitedError, RateLimiterService> {
	return Effect.gen(function* () {
		const rateLimiter = yield* RateLimiterService;
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
