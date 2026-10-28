import { Schema } from "effect";

export class TimeZoneResolverError extends Schema.TaggedError<TimeZoneResolverError>()(
	"TimeZoneResolverError",
	{
		latitude: Schema.Number,
		longitude: Schema.Number,
		reason: Schema.String,
	},
) {}
