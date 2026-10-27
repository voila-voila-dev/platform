import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { RetryPolicy, retryPolicy } from "#http/lib/retry-policy";

describe("retryPolicy", () => {
	it("runs a failing effect once plus its attempts", async () => {
		let runs = 0;
		const failing = Effect.suspend(() => {
			runs += 1;
			return Effect.fail("down");
		});
		// The real backoff shape, at millisecond scale so the test does not sleep.
		const policy = retryPolicy({
			attempts: 3,
			initialDelay: "1 millis",
			maximumDelay: "2 millis",
		});

		await Effect.runPromiseExit(
			Effect.retry(failing, {
				schedule: policy.schedule,
				times: policy.attempts,
			}),
		);

		expect(runs).toBe(4);
	});

	it("backs off longer for a rate limit than for a blip", () => {
		expect(RetryPolicy.transient.attempts).toBe(2);
		expect(RetryPolicy.rateLimited.attempts).toBe(4);
	});
});
