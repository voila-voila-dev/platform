import { Context, type Effect } from "effect";
import type { RateLimitedError } from "#rate-limiting/errors/rate-limited-error";

export class RateLimiterService extends Context.Service<
	RateLimiterService,
	{
		readonly consume: (
			key: string,
			windowSeconds: number,
		) => Effect.Effect<void, RateLimitedError>;
		readonly consumeMany: (
			key: string,
			windowSeconds: number,
			limit: number,
		) => Effect.Effect<void, RateLimitedError>;
		readonly consumeAttempt: (
			key: string,
			windowSeconds: number,
			limit: number,
		) => Effect.Effect<void, RateLimitedError>;
	}
>()("@voila.dev/platform/RateLimiterService") {}
