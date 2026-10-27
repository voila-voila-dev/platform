import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { fakeFetch } from "#http/lib/fake-fetch.test-helper";
import { globalFetch } from "#http/lib/fetch";
import { OutboundFetch, outboundFetch } from "#http/services/outbound-fetch";

describe("outboundFetch", () => {
	it("is the global fetch when nothing is provided", async () => {
		expect(await Effect.runPromise(outboundFetch("acme"))).toBe(globalFetch);
	});

	it("asks the provided chooser for the partner's fetch", async () => {
		const acme = fakeFetch(() => new Response("acme"));
		const asked: Array<string> = [];

		const chosen = await Effect.runPromise(
			outboundFetch("acme").pipe(
				Effect.provideService(OutboundFetch, (partner) => {
					asked.push(partner);
					return acme.fetch;
				}),
			),
		);

		expect(chosen).toBe(acme.fetch);
		expect(asked).toEqual(["acme"]);
	});
});
