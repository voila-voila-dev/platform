import { Schema } from "effect";

// `rejected` is the partner refusing this input: the partner works. `failed`
// is the partner, or our credentials, not working. Keeping them apart is what
// makes a health check meaningful.
export const RequestOutcome = Schema.Literals([
	"succeeded",
	"rejected",
	"failed",
]);

export type RequestOutcome = typeof RequestOutcome.Type;

// Credentials refused, a timeout, a throttle: our side or the partner is broken, whatever we sent.
const FAILING_CLIENT_STATUSES: ReadonlySet<number> = new Set([
	401, 403, 408, 429,
]);

// `status` is `null` when no response came back: a network error or a timeout.
export function requestOutcome(status: number | null): RequestOutcome {
	if (status === null || status >= 500 || FAILING_CLIENT_STATUSES.has(status)) {
		return "failed";
	}
	return status >= 400 ? "rejected" : "succeeded";
}
