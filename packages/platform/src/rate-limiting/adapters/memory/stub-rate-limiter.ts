import { Effect, Layer } from "effect";
import { RateLimitedError } from "#rate-limiting/errors/rate-limited-error";
import { RateLimiterService } from "#rate-limiting/services/rate-limiter-service";

export function stubRateLimiter(failOn?: string) {
	function guard(key: string) {
		return failOn !== undefined && key.includes(failOn)
			? Effect.fail(new RateLimitedError({ retryAfterSeconds: 60 }))
			: Effect.void;
	}
	return Layer.succeed(RateLimiterService, {
		consume: (key) => guard(key),
		consumeMany: (key) => guard(key),
		consumeAttempt: (key) => guard(key),
	});
}
