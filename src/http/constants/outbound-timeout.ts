import { Duration } from "effect";

// Without a deadline a stalled partner is not an error but an unbounded wait,
// pinning the request that triggered it and its resources.
export const OutboundTimeout = {
	roundTrip: Duration.seconds(15),
	// A model call or a file download, which legitimately take tens of seconds.
	long: Duration.seconds(60),
} as const;
