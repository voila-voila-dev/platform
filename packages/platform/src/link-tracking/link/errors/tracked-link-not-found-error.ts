import { Schema } from "effect";

export class TrackedLinkNotFoundError extends Schema.TaggedError<TrackedLinkNotFoundError>()(
	"TrackedLinkNotFoundError",
	{
		id: Schema.String,
	},
) {}
