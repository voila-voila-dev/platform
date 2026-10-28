import { Effect, Schema } from "effect";
import { HttpResponseError } from "#http/errors/http-response-error";

export class HttpResponse extends Schema.Class<HttpResponse>("HttpResponse")({
	url: Schema.String,
	status: Schema.Number,
	contentType: Schema.String,
	body: Schema.Uint8Array,
	truncated: Schema.Boolean,
}) {
	get isSuccess(): boolean {
		return this.status >= 200 && this.status < 300;
	}

	get text(): string {
		return new TextDecoder().decode(this.body);
	}

	ensureSuccess(): Effect.Effect<HttpResponse, HttpResponseError> {
		if (!this.isSuccess)
			return Effect.fail(
				new HttpResponseError({
					url: this.url,
					reason: "status",
					message: `http ${this.status}`,
				}),
			);
		if (this.truncated)
			return Effect.fail(
				new HttpResponseError({
					url: this.url,
					reason: "truncated",
					message: `response body larger than ${this.body.byteLength} bytes`,
				}),
			);
		return Effect.succeed(this);
	}

	json<A, I>(schema: Schema.Codec<A, I>): Effect.Effect<A, HttpResponseError> {
		return Effect.try({
			try: (): unknown => JSON.parse(this.text),
			catch: (cause) =>
				new HttpResponseError({
					url: this.url,
					reason: "undecodable",
					message: `response was not valid JSON: ${String(cause)}`,
				}),
		}).pipe(
			Effect.flatMap((payload) =>
				Schema.decodeUnknownEffect(schema)(payload).pipe(
					Effect.mapError(
						(parseError) =>
							new HttpResponseError({
								url: this.url,
								reason: "undecodable",
								message: `payload did not match schema: ${String(parseError)}`,
							}),
					),
				),
			),
		);
	}
}
