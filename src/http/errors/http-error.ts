import { Schema } from "effect";

export class HttpError extends Schema.TaggedError<HttpError>()("HttpError", {
	reason: Schema.Literals(["blocked", "network", "timeout", "interrupted"]),
	message: Schema.String,
}) {}
