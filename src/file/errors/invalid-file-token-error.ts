import { Schema } from "effect";

export class InvalidFileTokenError extends Schema.TaggedError<InvalidFileTokenError>()(
	"InvalidFileTokenError",
	{},
) {}
