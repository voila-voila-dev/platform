import { Schema } from "effect";

export const HttpRequest = Schema.Struct({
	method: Schema.Literals(["GET", "POST", "PUT"]),
	url: Schema.String,
	headers: Schema.Record(Schema.String, Schema.String),
	body: Schema.optional(Schema.String),
	timeoutMs: Schema.Number,
	maxResponseBytes: Schema.Number,
});

export type HttpRequest = typeof HttpRequest.Type;

export interface HttpRequestLimits {
	readonly timeoutMs: number;
	readonly maxResponseBytes: number;
}

export function httpGet(url: string, limits: HttpRequestLimits): HttpRequest {
	return HttpRequest.make({ method: "GET", url, headers: {}, ...limits });
}
