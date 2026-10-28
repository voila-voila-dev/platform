import { type Duration, Schedule } from "effect";

export interface RetryPolicy {
	readonly attempts: number;
	readonly schedule: Schedule.Schedule<Duration.Duration>;
}

// One backoff shape for every partner, so a stalled partner's amplification
// stays possible to reason about; a policy only picks its bounds. Jitter keeps
// every fiber that failed on the same blip from retrying in the same
// millisecond and reproducing it.
export function retryPolicy(options: {
	readonly attempts: number;
	readonly initialDelay: Duration.Input;
	readonly maximumDelay: Duration.Input;
}): RetryPolicy {
	return {
		attempts: options.attempts,
		schedule: Schedule.min([
			Schedule.exponential(options.initialDelay),
			Schedule.spaced(options.maximumDelay),
		]).pipe(Schedule.jittered),
	};
}

export const RetryPolicy = {
	// Outlives a blip while the caller's own request is still there for the answer.
	transient: retryPolicy({
		attempts: 2,
		initialDelay: "100 millis",
		maximumDelay: "1 second",
	}),
	// A 429: lands after the rate-limit window closes, since retrying inside
	// the same second only feeds the limiter.
	rateLimited: retryPolicy({
		attempts: 4,
		initialDelay: "1 second",
		maximumDelay: "5 seconds",
	}),
} as const;
