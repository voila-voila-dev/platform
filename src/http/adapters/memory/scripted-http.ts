import { Effect, Layer } from "effect";
import { HttpError } from "#http/errors/http-error";
import { HttpService } from "#http/services/http-service";
import type { HttpRequest } from "#http/value-objects/http-request";
import { HttpResponse } from "#http/value-objects/http-response";

export interface ScriptedAnswer {
	readonly status?: number;
	readonly body?: string | Uint8Array;
	readonly contentType?: string;
}

function toResponse(url: string, answer: ScriptedAnswer): HttpResponse {
	const body = answer.body ?? "{}";
	return new HttpResponse({
		url,
		status: answer.status ?? 200,
		contentType: answer.contentType ?? "application/json",
		body: typeof body === "string" ? new TextEncoder().encode(body) : body,
		truncated: false,
	});
}

export function scriptedHttp(
	respond: (request: HttpRequest) => ScriptedAnswer | HttpError = () => ({}),
) {
	const requests: Array<HttpRequest> = [];
	return {
		requests,
		layer: Layer.succeed(HttpService, {
			send: (request) =>
				Effect.suspend(() => {
					requests.push(request);
					const answer = respond(request);
					return answer instanceof HttpError
						? Effect.fail(answer)
						: Effect.succeed(toResponse(request.url, answer));
				}),
		}),
	};
}
