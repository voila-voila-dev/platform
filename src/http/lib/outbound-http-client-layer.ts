import { Effect, Layer } from "effect";
import { FetchHttpClient, HttpClient } from "effect/http";
import { outboundFetch } from "#http/services/outbound-fetch";

// The fetch client reads its `fetch` from the calling fiber, so the partner's
// is provided on each request rather than once.
export function outboundHttpClientLayer(
	partner: string,
): Layer.Layer<HttpClient.HttpClient> {
	return Layer.effect(
		HttpClient.HttpClient,
		Effect.gen(function* () {
			const client = yield* HttpClient.HttpClient;
			const fetchFunction = yield* outboundFetch(partner);
			// The runtime's `fetch` type carries extras (Bun's `preconnect`) the client never calls.
			const asGlobal = fetchFunction as typeof globalThis.fetch;
			return HttpClient.transform(client, (response) =>
				Effect.provideService(response, FetchHttpClient.Fetch, asGlobal),
			);
		}),
	).pipe(Layer.provide(FetchHttpClient.layer));
}
