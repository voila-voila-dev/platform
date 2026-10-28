import { describe, expect, it } from "bun:test";
import { fakeFetch } from "#http/lib/fake-fetch.test-helper";
import {
	type RecordingOptions,
	recordingFetch,
} from "#http/lib/recording-fetch";
import type { RecordedRequest } from "#http/value-objects/recorded-request";

function harness(answer: () => Response, options: RecordingOptions = {}) {
	const recorded: Array<RecordedRequest> = [];
	const base = fakeFetch(answer);
	const fetch = recordingFetch(
		"acme",
		{ record: (request) => recorded.push(request) },
		{
			base: base.fetch,
			...options,
		},
	);
	return { fetch, recorded };
}

// A failed response's body is read off a clone, after the caller has its response.
function settled() {
	return new Promise((resolve) => setTimeout(resolve, 10));
}

describe("recordingFetch", () => {
	it("records a success and hands back the partner's response", async () => {
		const original = new Response('{"valid":true}', {
			status: 200,
			headers: { "x-request-id": "req_123" },
		});
		const { fetch, recorded } = harness(() => original);

		const response = await fetch(
			"https://api.acme.test/v1/check?email=a%40b.test",
			{ method: "post" },
		);

		expect(response).toBe(original);
		expect(await response.json()).toEqual({ valid: true });
		expect(recorded).toHaveLength(1);
		expect(recorded[0]).toMatchObject({
			partner: "acme",
			method: "POST",
			host: "api.acme.test",
			path: "/v1/check",
			status: 200,
			outcome: "succeeded",
			failure: null,
			providerRequestId: "req_123",
		});
	});

	it("records a 404 as rejected with its body", async () => {
		const { fetch, recorded } = harness(
			() => new Response("unknown number", { status: 404 }),
		);

		const response = await fetch("https://api.acme.test/v1/numbers/123");
		expect(await response.text()).toBe("unknown number");
		await settled();

		expect(recorded[0]).toMatchObject({
			method: "GET",
			status: 404,
			outcome: "rejected",
			failure: "unknown number",
		});
	});

	it("records a 503 as failed, its body trimmed and scrubbed", async () => {
		const body = `down for jane@example.com ${"x".repeat(2000)}`;
		const { fetch, recorded } = harness(
			() => new Response(body, { status: 503, headers: { "cf-ray": "8f0a" } }),
		);

		await fetch("https://api.acme.test/v1/charges");
		await settled();

		const failure = recorded[0]?.failure ?? "";
		expect(recorded[0]).toMatchObject({
			status: 503,
			outcome: "failed",
			providerRequestId: "8f0a",
		});
		expect(failure.startsWith("down for «email» xxx")).toBe(true);
		expect(failure.length).toBeLessThanOrEqual(1000);
	});

	it("records a thrown network error as failed and rethrows it unchanged", async () => {
		const thrown = new TypeError("fetch failed");
		const { fetch, recorded } = harness(() => {
			throw thrown;
		});

		const attempt = fetch("https://api.acme.test/v1/charges?secret=abc", {
			method: "POST",
		});

		await expect(attempt).rejects.toBe(thrown);
		expect(recorded[0]).toMatchObject({
			path: "/v1/charges",
			status: null,
			outcome: "failed",
			failure: "TypeError: fetch failed",
			providerRequestId: null,
		});
	});

	it("names the partner from the Host header of a request pinned to its address", async () => {
		const { fetch, recorded } = harness(() => new Response("{}"));

		await fetch("https://93.184.216.34/orders", {
			headers: { host: "api.acme.test" },
		});

		expect(recorded[0]).toMatchObject({ host: "api.acme.test" });
	});

	it("logs a request to a name by that name, whatever its Host header says", async () => {
		const { fetch, recorded } = harness(() => new Response("{}"));

		await fetch("https://api.acme.test/x", { headers: { host: "other.test" } });

		expect(recorded[0]).toMatchObject({ host: "api.acme.test" });
	});

	it("never reads the error body of a partner that may echo a credential", async () => {
		const original = new Response("invalid key sk_live_4f2a", { status: 401 });
		const { fetch, recorded } = harness(() => original, {
			readFailureBody: false,
		});

		const response = await fetch("https://api.acme.test/orders");

		expect(response.bodyUsed).toBe(false);
		expect(recorded[0]).toMatchObject({ status: 401, failure: "HTTP 401" });
	});

	it("keeps only the class of a thrown error when bodies are unread", async () => {
		const { fetch, recorded } = harness(
			() => {
				throw new TypeError("bad key sk_live_4f2a");
			},
			{ readFailureBody: false },
		);

		await expect(fetch("https://api.acme.test/")).rejects.toThrow();

		expect(recorded[0]?.failure).toBe("TypeError");
	});

	it("masks a secret the path carries", async () => {
		const { fetch, recorded } = harness(
			() => new Response(null, { status: 204 }),
			{
				redactPath: (path) => path.replace(/^(\/hooks\/[^/]+\/)[^/]+/u, "$1…"),
			},
		);

		await fetch("https://chat.acme.test/hooks/123/s3cr3t-token");

		expect(recorded[0]?.path).toBe("/hooks/123/…");
	});

	it("gives each request a fresh id, or the caller's own", async () => {
		const random = harness(() => new Response("{}"));
		await random.fetch("https://api.acme.test/");
		await random.fetch("https://api.acme.test/");
		const [first, second] = random.recorded.map((request) => request.id);
		expect(first).toMatch(/^[0-9a-f]{32}$/u);
		expect(first).not.toBe(second);

		const sequenced = harness(() => new Response("{}"), {
			makeId: () => "req-1",
		});
		await sequenced.fetch("https://api.acme.test/");
		expect(sequenced.recorded[0]?.id).toBe("req-1");
	});

	it("never fails the call when the recorder throws", async () => {
		const response = await recordingFetch(
			"acme",
			{
				record: () => {
					throw new Error("recorder down");
				},
			},
			{ base: fakeFetch(() => new Response("ok")).fetch },
		)("https://api.acme.test/");

		expect(await response.text()).toBe("ok");
	});
});
