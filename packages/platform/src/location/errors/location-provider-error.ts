import { Schema } from "effect";

export class LocationProviderError extends Schema.TaggedError<LocationProviderError>()(
	"LocationProviderError",
	{
		message: Schema.String,
	},
) {}
