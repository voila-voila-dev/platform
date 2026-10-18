import { Schema } from "effect";

export class RateLimitedError extends Schema.TaggedError<RateLimitedError>()(
	"RateLimitedError",
	{
		retryAfterSeconds: Schema.Number,
	},
) {}
