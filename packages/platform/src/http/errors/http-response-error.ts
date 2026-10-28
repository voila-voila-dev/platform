import { Schema } from "effect";

export class HttpResponseError extends Schema.TaggedError<HttpResponseError>()(
	"HttpResponseError",
	{
		url: Schema.String,
		reason: Schema.Literals(["status", "truncated", "undecodable"]),
		message: Schema.String,
	},
) {}
