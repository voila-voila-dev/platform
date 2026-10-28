import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { HttpClient } from "effect/http";
import { fakeFetch } from "#http/lib/fake-fetch.test-helper";
import { outboundHttpClientLayer } from "#http/lib/outbound-http-client-layer";
import { OutboundFetch } from "#http/services/outbound-fetch";

describe("outboundHttpClientLayer", () => {
	it("sends an HttpClient request through the partner's fetch", async () => {
		const partner = fakeFetch(() => new Response("{}", { status: 201 }));
		const asked: Array<string> = [];

		const status = await Effect.runPromise(
			HttpClient.get("https://api.acme.test/v1/things").pipe(
				Effect.map((response) => response.status),
				Effect.provide(outboundHttpClientLayer("acme")),
				Effect.provideService(OutboundFetch, (name) => {
					asked.push(name);
					return partner.fetch;
				}),
			),
		);

		expect(status).toBe(201);
		expect(asked).toEqual(["acme"]);
		expect(partner.calls.map((call) => call.url)).toEqual([
			"https://api.acme.test/v1/things",
		]);
	});
});
