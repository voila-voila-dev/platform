import { Context, type Effect } from "effect";
import type { HttpError } from "#http/errors/http-error";
import type { HttpRequest } from "#http/value-objects/http-request";
import type { HttpResponse } from "#http/value-objects/http-response";

/** Sends one request and reads its answer up to `maxResponseBytes`; any status comes back as a response, only a request that got no answer fails. */
export class HttpService extends Context.Service<
	HttpService,
	{
		readonly send: (
			request: HttpRequest,
		) => Effect.Effect<HttpResponse, HttpError>;
	}
>()("@voila.dev/platform/HttpService") {}
