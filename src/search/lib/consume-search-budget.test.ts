import { describe, expect, it } from "bun:test";
import { Effect, Layer } from "effect";
import { SystemActor } from "#core/actor/system-actor";
import { RateLimiterService } from "#rate-limiting/services/rate-limiter-service";
import { consumeSearchBudget } from "#search/lib/consume-search-budget";
import { SearchBudget } from "#search/services/search-budget";

function recordingRateLimiter() {
	const consumed: Array<readonly [string, number, number]> = [];
	return {
		consumed,
		layer: Layer.succeed(RateLimiterService, {
			consume: () => Effect.void,
			consumeMany: (key, windowSeconds, limit) =>
				Effect.sync(() => {
					consumed.push([key, windowSeconds, limit]);
				}),
			consumeAttempt: () => Effect.void,
		}),
	};
}

describe("consumeSearchBudget", () => {
	it("counts each caller and the whole surface on the default limits", async () => {
		const limiter = recordingRateLimiter();
		await Effect.runPromise(
			consumeSearchBudget("notes", new SystemActor(), "203.0.113.7").pipe(
				Effect.provide(limiter.layer),
			),
		);

		expect(limiter.consumed).toStrictEqual([
			["search:notes:caller:203.0.113.7", 60, 60],
			["search:notes:global", 60, 600],
		]);
	});

	it("takes the limits the application provides", async () => {
		const limiter = recordingRateLimiter();
		await Effect.runPromise(
			consumeSearchBudget("notes", new SystemActor(), "203.0.113.7").pipe(
				Effect.provide(limiter.layer),
				Effect.provideService(SearchBudget, {
					windowSeconds: 10,
					perCaller: 5,
					global: 50,
				}),
			),
		);

		expect(limiter.consumed).toStrictEqual([
			["search:notes:caller:203.0.113.7", 10, 5],
			["search:notes:global", 10, 50],
		]);
	});
});
