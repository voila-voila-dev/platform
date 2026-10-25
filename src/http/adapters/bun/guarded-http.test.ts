import { describe, expect, it } from "bun:test";
import { Effect, Result } from "effect";
import {
	type Fetch,
	guardedHttp,
	type HostResolver,
} from "#http/adapters/bun/guarded-http";
import type { HttpError } from "#http/errors/http-error";
import { HttpService } from "#http/services/http-service";
import { HttpRequest, httpGet } from "#http/value-objects/http-request";
import type { HttpResponse } from "#http/value-objects/http-response";

const PARTNER_ADDRESS = "93.184.216.34";

interface RecordedCall {
	readonly url: string;
	readonly init: RequestInit;
}

function post(url: string): HttpRequest {
	return HttpRequest.make({
		method: "POST",
		url,
		headers: { authorization: "Bearer sk_live_partner" },
		body: '{"reference":"PO-1"}',
		timeoutMs: 1000,
		maxResponseBytes: 16,
	});
}

function table(
	addresses: Readonly<Record<string, ReadonlyArray<string>>>,
): HostResolver {
	return async (hostname) => addresses[hostname] ?? [];
}

function run(
	request: HttpRequest,
	options: {
		readonly resolve: HostResolver;
		readonly respond?: (url: string, init: RequestInit) => Promise<Response>;
		readonly userAgent?: string;
	},
) {
	const calls: Array<RecordedCall> = [];
	const fetchFunction: Fetch = async (input, init = {}) => {
		calls.push({ url: String(input), init });
		return (
			options.respond?.(String(input), init) ??
			new Response("ok", { status: 201 })
		);
	};
	const layer = guardedHttp({
		resolve: options.resolve,
		fetch: () => Effect.succeed(fetchFunction),
		...(options.userAgent !== undefined && { userAgent: options.userAgent }),
	});
	return Effect.runPromise(
		Effect.gen(function* () {
			const http = yield* HttpService;
			return yield* http.send(request);
		}).pipe(Effect.result, Effect.provide(layer)),
	).then((result) => ({ result, calls }));
}

function response(result: Result.Result<HttpResponse, HttpError>) {
	if (Result.isFailure(result)) throw new Error(result.failure.message);
	return result.success;
}

function failure(result: Result.Result<HttpResponse, HttpError>) {
	if (Result.isSuccess(result)) throw new Error("expected a failure");
	return result.failure;
}

const partner = table({ "api.partner.test": [PARTNER_ADDRESS] });

describe("guardedHttp, any method but GET", () => {
	it("connects to the checked address, with the name for the Host header and the certificate", async () => {
		const { result, calls } = await run(
			post("https://api.partner.test/orders"),
			{ resolve: partner },
		);

		expect(response(result)).toMatchObject({ status: 201, truncated: false });
		expect(response(result).text).toBe("ok");
		expect(calls).toHaveLength(1);
		expect(calls[0]?.url).toBe(`https://${PARTNER_ADDRESS}/orders`);
		expect(calls[0]?.init.headers).toEqual({
			authorization: "Bearer sk_live_partner",
			host: "api.partner.test",
		});
		expect(calls[0]?.init.redirect).toBe("manual");
		expect(calls[0]?.init).toMatchObject({
			tls: { serverName: "api.partner.test" },
		});
	});

	it.each([
		["plain http", "http://api.partner.test/orders"],
		["a loopback address", "https://127.0.0.1/orders"],
		["a private address", "https://10.0.0.5/orders"],
		["an IPv6 loopback", "https://[::1]/orders"],
		["a port other than 443", "https://api.partner.test:8443/orders"],
		["a password in the URL", "https://user:secret@api.partner.test/orders"],
	])("refuses %s before any socket opens", async (_, url) => {
		const { result, calls } = await run(post(url), { resolve: partner });

		expect(failure(result).reason).toBe("blocked");
		expect(calls).toHaveLength(0);
	});

	it("refuses a name that resolves to the cloud metadata address", async () => {
		const { result, calls } = await run(
			post("https://metadata.partner.test/"),
			{
				resolve: table({ "metadata.partner.test": ["169.254.169.254"] }),
			},
		);

		expect(failure(result).reason).toBe("blocked");
		expect(calls).toHaveLength(0);
	});

	it("refuses a name when any one of its addresses is private", async () => {
		const { result, calls } = await run(post("https://mixed.partner.test/"), {
			resolve: table({ "mixed.partner.test": [PARTNER_ADDRESS, "10.0.0.5"] }),
		});

		expect(failure(result).reason).toBe("blocked");
		expect(calls).toHaveLength(0);
	});

	it("never follows a redirect: the 3xx comes back and nothing else is sent", async () => {
		const { result, calls } = await run(
			post("https://api.partner.test/orders"),
			{
				resolve: partner,
				respond: async () =>
					Response.redirect("http://169.254.169.254/latest/meta-data", 307),
			},
		);

		expect(response(result).status).toBe(307);
		expect(calls).toHaveLength(1);
	});

	it("cuts the response body at the byte limit", async () => {
		const { result } = await run(post("https://api.partner.test/orders"), {
			resolve: partner,
			respond: async () => new Response("x".repeat(100), { status: 200 }),
		});

		expect(response(result)).toMatchObject({ status: 200, truncated: true });
		expect(response(result).text).toBe("x".repeat(16));
	});

	it("answers network when the name does not resolve", async () => {
		const { result, calls } = await run(post("https://nowhere.partner.test/"), {
			resolve: table({}),
		});

		expect(failure(result).reason).toBe("network");
		expect(calls).toHaveLength(0);
	});

	it("answers timeout when the partner does not answer in time", async () => {
		const { result } = await run(
			{ ...post("https://api.partner.test/orders"), timeoutMs: 20 },
			{
				resolve: partner,
				respond: (_, init) =>
					new Promise((_resolve, reject) =>
						init.signal?.addEventListener("abort", () =>
							reject(init.signal?.reason),
						),
					),
			},
		);

		expect(failure(result).reason).toBe("timeout");
	});

	it("drops a caller's own Host and framing headers, whatever their case", async () => {
		const { calls } = await run(
			{
				...post("https://api.partner.test/orders"),
				headers: {
					Host: "internal.service",
					"Content-Length": "0",
					authorization: "Bearer key",
				},
			},
			{ resolve: partner },
		);

		expect(calls[0]?.init.headers).toEqual({
			authorization: "Bearer key",
			host: "api.partner.test",
		});
	});

	it("connects over IPv4 when the name has both families", async () => {
		const { calls } = await run(post("https://api.partner.test/orders"), {
			resolve: table({
				"api.partner.test": ["2606:2800:220:1::1", PARTNER_ADDRESS],
			}),
		});

		expect(calls[0]?.url).toBe(`https://${PARTNER_ADDRESS}/orders`);
	});

	it.each([
		[
			"network",
			Object.assign(new Error("refused"), { code: "ConnectionRefused" }),
		],
		["interrupted", Object.assign(new Error("reset"), { code: "ECONNRESET" })],
	] as const)(
		"answers %s when the transport throws %p",
		async (reason, thrown) => {
			const { result } = await run(post("https://api.partner.test/"), {
				resolve: partner,
				respond: async () => {
					throw thrown;
				},
			});

			expect(failure(result).reason).toBe(reason);
		},
	);
});

describe("guardedHttp, GET", () => {
	const limits = { timeoutMs: 1000, maxResponseBytes: 1024 };
	const site = table({
		"www.site.test": [PARTNER_ADDRESS],
		"cdn.site.test": [PARTNER_ADDRESS],
		"internal.site.test": ["10.0.0.5"],
	});

	it("fetches a public http URL with the user agent", async () => {
		const { result, calls } = await run(
			httpGet("http://www.site.test/logo.png", limits),
			{ resolve: site, userAgent: "platform-bot/1.0" },
		);

		expect(response(result)).toMatchObject({
			url: "http://www.site.test/logo.png",
			status: 201,
		});
		expect(calls[0]?.url).toBe("http://www.site.test/logo.png");
		expect(calls[0]?.init.headers).toEqual({
			"user-agent": "platform-bot/1.0",
		});
	});

	it("follows a redirect to a public address and answers with the final URL", async () => {
		const { result, calls } = await run(
			httpGet("https://www.site.test/logo", limits),
			{
				resolve: site,
				respond: async (url) =>
					url.startsWith("https://www.site.test")
						? new Response(null, {
								status: 302,
								headers: { location: "https://cdn.site.test/logo.png" },
							})
						: new Response("png", { status: 200 }),
			},
		);

		expect(response(result)).toMatchObject({
			url: "https://cdn.site.test/logo.png",
			status: 200,
		});
		expect(calls.map((call) => call.url)).toEqual([
			"https://www.site.test/logo",
			"https://cdn.site.test/logo.png",
		]);
	});

	it("refuses a redirect to a private address", async () => {
		const { result, calls } = await run(
			httpGet("https://www.site.test/logo", limits),
			{
				resolve: site,
				respond: async () =>
					new Response(null, {
						status: 302,
						headers: { location: "https://internal.site.test/admin" },
					}),
			},
		);

		expect(failure(result).reason).toBe("blocked");
		expect(calls).toHaveLength(1);
	});

	it("gives up after three redirects", async () => {
		const { result, calls } = await run(
			httpGet("https://www.site.test/loop", limits),
			{
				resolve: site,
				respond: async () =>
					new Response(null, {
						status: 302,
						headers: { location: "https://www.site.test/loop" },
					}),
			},
		);

		expect(failure(result).reason).toBe("blocked");
		expect(calls).toHaveLength(4);
	});

	it("refuses a port that is not a web port", async () => {
		const { result, calls } = await run(
			httpGet("http://www.site.test:6379/", limits),
			{ resolve: site },
		);

		expect(failure(result).reason).toBe("blocked");
		expect(calls).toHaveLength(0);
	});
});
