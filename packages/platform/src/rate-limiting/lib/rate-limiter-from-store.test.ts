import { describe, expect, it } from "bun:test";
import { Effect, Layer } from "effect";
import { RateLimiter as EffectRateLimiter } from "effect/persistence";
import { rateLimiterFromStore } from "#rate-limiting/lib/rate-limiter-from-store";
import { RateLimiterService } from "#rate-limiting/services/rate-limiter-service";

function unavailableStore() {
	const failure = Effect.fail(
		new EffectRateLimiter.RateLimiterError({
			reason: new EffectRateLimiter.RateLimitStoreError({
				message: "connection refused",
			}),
		}),
	);
	return Layer.succeed(EffectRateLimiter.RateLimiterStore, {
		fixedWindow: () => failure,
		tokenBucket: () => failure,
		adaptiveConsume: () => failure,
		adaptiveFeedback: () => failure,
	});
}

function run<A, E>(
	effect: Effect.Effect<A, E, RateLimiterService>,
	store: Layer.Layer<EffectRateLimiter.RateLimiterStore>,
) {
	return Effect.runPromise(
		Effect.exit(effect).pipe(
			Effect.provide(rateLimiterFromStore.pipe(Layer.provide(store))),
		),
	);
}

describe("rateLimiterFromStore", () => {
	it("refuses past the limit, saying when to come back", async () => {
		const exit = await run(
			Effect.gen(function* () {
				const limiter = yield* RateLimiterService;
				yield* limiter.consumeMany("key", 60, 2);
				yield* limiter.consumeMany("key", 60, 2);
				yield* limiter.consumeMany("key", 60, 2);
			}),
			EffectRateLimiter.layerStoreMemory,
		);

		expect(exit).toMatchObject({
			_tag: "Failure",
			cause: {
				reasons: [
					{ error: { _tag: "RateLimitedError", retryAfterSeconds: 60 } },
				],
			},
		});
	});

	it("lets throttled calls through when the store is down, and denies attempts", async () => {
		const throttled = await run(
			Effect.gen(function* () {
				const limiter = yield* RateLimiterService;
				yield* limiter.consume("key", 60);
				yield* limiter.consumeMany("key", 60, 5);
			}),
			unavailableStore(),
		);
		const attempt = await run(
			Effect.flatMap(RateLimiterService, (limiter) =>
				limiter.consumeAttempt("key", 300, 5),
			),
			unavailableStore(),
		);

		expect(throttled._tag).toBe("Success");
		expect(attempt).toMatchObject({
			_tag: "Failure",
			cause: {
				reasons: [
					{ error: { _tag: "RateLimitedError", retryAfterSeconds: 300 } },
				],
			},
		});
	});
});
