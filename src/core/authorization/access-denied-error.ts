import { Schema } from "effect";

export class AccessDeniedError extends Schema.TaggedError<AccessDeniedError>()(
	"AccessDeniedError",
	{},
) {}
