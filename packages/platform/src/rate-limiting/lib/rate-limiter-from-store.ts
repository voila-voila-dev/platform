import { Duration, Effect, Layer } from "effect";
import { RateLimiter as EffectRateLimiter } from "effect/persistence";
import { RateLimitedError } from "#rate-limiting/errors/rate-limited-error";
import { RateLimiterService } from "#rate-limiting/services/rate-limiter-service";

// When the store is down, a throttle against spam lets the call through (an
// outage must not stop a code from being sent), while an attempt cap denies:
// it is the brute-force control. Keys name the email, phone or IP they count,
// so they stay out of the logs.
export const rateLimiterFromStore: Layer.Layer<
	RateLimiterService,
	never,
	EffectRateLimiter.RateLimiterStore
> = Layer.effect(
	RateLimiterService,
	Effect.map(EffectRateLimiter.make, (limiter) => {
		function consume(
			key: string,
			windowSeconds: number,
			limit: number,
			whenUnavailable: (
				reason: string,
			) => Effect.Effect<void, RateLimitedError>,
		) {
			return limiter
				.consume({
					key,
					limit,
					window: Duration.seconds(windowSeconds),
					algorithm: "fixed-window",
					onExceeded: "fail",
				})
				.pipe(
					Effect.asVoid,
					Effect.catch(({ reason }) =>
						reason._tag === "RateLimitExceeded"
							? Effect.fail(
									new RateLimitedError({
										retryAfterSeconds: Math.max(
											1,
											Math.ceil(Duration.toSeconds(reason.retryAfter)),
										),
									}),
								)
							: whenUnavailable(reason.message),
					),
				);
		}

		function throttle(key: string, windowSeconds: number, limit: number) {
			return consume(key, windowSeconds, limit, (reason) =>
				Effect.logWarning(`rate limit store unavailable: ${reason}`),
			);
		}

		return {
			consume: (key, windowSeconds) => throttle(key, windowSeconds, 1),
			consumeMany: throttle,
			consumeAttempt: (key, windowSeconds, limit) =>
				consume(key, windowSeconds, limit, (reason) =>
					Effect.logWarning(
						`rate limit store unavailable, denying: ${reason}`,
					).pipe(
						Effect.andThen(
							Effect.fail(
								new RateLimitedError({ retryAfterSeconds: windowSeconds }),
							),
						),
					),
				),
		};
	}),
);
