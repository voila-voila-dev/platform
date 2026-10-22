import { Schema } from "effect";

export class CacheTransportError extends Schema.TaggedError<CacheTransportError>()(
	"CacheTransportError",
	{ key: Schema.String, reason: Schema.String },
) {}
