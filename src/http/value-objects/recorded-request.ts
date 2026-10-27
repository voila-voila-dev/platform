import { Schema } from "effect";
import { RequestOutcome } from "#http/value-objects/request-outcome";

// The path carries no query string: that is where partners take emails,
// tokens and search terms.
export const RecordedRequest = Schema.Struct({
	id: Schema.String,
	partner: Schema.String,
	method: Schema.String,
	host: Schema.String,
	path: Schema.String,
	status: Schema.NullOr(Schema.Int),
	outcome: RequestOutcome,
	durationMilliseconds: Schema.Int,
	// The network error, or the start of the body of a response that was not a success.
	failure: Schema.NullOr(Schema.String),
	// The partner's own id for the request, to quote to its support.
	providerRequestId: Schema.NullOr(Schema.String),
	startedAt: Schema.DateTimeUtc,
});

export type RecordedRequest = typeof RecordedRequest.Type;
