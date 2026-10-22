import { Schema } from "effect";

export class CacheMissError extends Schema.TaggedError<CacheMissError>()(
	"CacheMissError",
	{ key: Schema.String },
) {}
