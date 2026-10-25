import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { Effect, Layer, Predicate } from "effect";
import { boundedBody } from "#http/adapters/bun/bounded-body";
import { isPrivateAddress } from "#http/adapters/bun/private-address";
import { HttpError } from "#http/errors/http-error";
import { HttpService } from "#http/services/http-service";
import type { HttpRequest } from "#http/value-objects/http-request";
import { HttpResponse } from "#http/value-objects/http-response";

export type Fetch = (
	input: string | URL | Request,
	init?: RequestInit,
) => Promise<Response>;

/** Every address a hostname resolves to; a test passes a table instead of asking DNS. */
export type HostResolver = (hostname: string) => Promise<ReadonlyArray<string>>;

export interface GuardedHttpOptions {
	/** Sent on a GET whose caller set none. */
	readonly userAgent?: string;
	readonly resolve?: HostResolver;
	/** The `fetch` a request goes through, chosen per request (an app's request log, say); the global one by default. */
	readonly fetch?: (request: HttpRequest) => Effect.Effect<Fetch>;
	readonly lookupTimeoutMs?: number;
}

interface Refusal {
	readonly reason: HttpError["reason"];
	readonly message: string;
}

const DEFAULT_LOOKUP_TIMEOUT_MS = 5000;
const MAX_REDIRECTS = 3;
const WEB_PROTOCOLS: ReadonlySet<string> = new Set(["http:", "https:"]);
const WEB_PORTS: ReadonlySet<string> = new Set(["", "80", "443"]);

// Set by the transport or by this adapter: a caller's copy would change where the request lands.
const TRANSPORT_HEADERS: ReadonlySet<string> = new Set([
	"host",
	"content-length",
	"transfer-encoding",
	"connection",
]);

// Bun's codes for a connection that never opened: nothing reached the other side.
const NOT_CONNECTED_CODES: ReadonlySet<string> = new Set([
	"ConnectionRefused",
	"ECONNREFUSED",
	"EHOSTUNREACH",
	"ENETUNREACH",
]);

const globalFetch: Fetch = (input, init) => fetch(input, init);

async function resolveWithDns(
	hostname: string,
): Promise<ReadonlyArray<string>> {
	const entries = await lookup(hostname, { all: true, verbatim: true });
	return entries.map((entry) => entry.address);
}

function refuse(message: string): Refusal {
	return { reason: "blocked", message };
}

function isRefusal(value: unknown): value is Refusal {
	return Predicate.hasProperty(value, "reason");
}

function parseTarget(
	raw: string,
	allowed: (url: URL) => string | null,
): URL | Refusal {
	if (!URL.canParse(raw)) return refuse(`unreadable URL: ${raw}`);
	const url = new URL(raw);
	if (url.username !== "" || url.password !== "")
		return refuse("the URL must not carry credentials");
	const refusal = allowed(url);
	return refusal === null ? url : refuse(refusal);
}

function httpsOn443(url: URL): string | null {
	if (url.protocol !== "https:")
		return `only https is allowed: ${url.protocol}`;
	return url.port === "" ? null : "only port 443 is allowed";
}

function webPort(url: URL): string | null {
	if (!WEB_PROTOCOLS.has(url.protocol))
		return `only http(s) is allowed: ${url.protocol}`;
	return WEB_PORTS.has(url.port) ? null : `port ${url.port} is not allowed`;
}

async function withTimeout<A>(promise: Promise<A>, ms: number): Promise<A> {
	let timer: ReturnType<typeof setTimeout> | undefined;
	try {
		return await Promise.race([
			promise,
			new Promise<never>((_, reject) => {
				timer = setTimeout(() => reject(new Error("DNS lookup timed out")), ms);
			}),
		]);
	} finally {
		clearTimeout(timer);
	}
}

function bareHostname(url: URL): string {
	return url.hostname.replace(/^\[|\]$/gu, "");
}

// One private address among several is enough to refuse: the connection may pick any of them.
async function publicAddress(
	hostname: string,
	resolve: HostResolver,
	lookupTimeoutMs: number,
): Promise<string | Refusal> {
	if (isIP(hostname) !== 0)
		return isPrivateAddress(hostname)
			? refuse(`private address refused: ${hostname}`)
			: hostname;
	let addresses: ReadonlyArray<string>;
	try {
		addresses = await withTimeout(resolve(hostname), lookupTimeoutMs);
	} catch (error) {
		return {
			reason: "network",
			message: `${hostname} does not resolve: ${String(error)}`,
		};
	}
	// IPv4 first: a pinned address gets no fallback, and many hosts have no IPv6 route out.
	const preferred =
		addresses.find((address) => isIP(address) === 4) ?? addresses[0];
	if (preferred === undefined)
		return { reason: "network", message: `${hostname} does not resolve` };
	const privateOne = addresses.find(isPrivateAddress);
	return privateOne === undefined
		? preferred
		: refuse(`${hostname} points to a private address (${privateOne})`);
}

function failureReason(error: unknown): HttpError["reason"] {
	if (error instanceof Error && error.name === "TimeoutError") return "timeout";
	const code = Predicate.hasProperty(error, "code") ? error.code : undefined;
	return typeof code === "string" && NOT_CONNECTED_CODES.has(code)
		? "network"
		: "interrupted";
}

function failure(error: unknown, url: URL, timeoutMs: number): Refusal {
	const reason = failureReason(error);
	return {
		reason,
		message: {
			timeout: `no answer from ${url.host} within ${timeoutMs} ms`,
			network: `could not connect to ${url.host}`,
			interrupted: `the exchange with ${url.host} was interrupted: ${error instanceof Error ? error.name : "error"}`,
			blocked: "",
		}[reason],
	};
}

function withoutTransportHeaders(
	headers: Readonly<Record<string, string>>,
): Record<string, string> {
	return Object.fromEntries(
		Object.entries(headers).filter(
			([name]) => !TRANSPORT_HEADERS.has(name.toLowerCase()),
		),
	);
}

async function toHttpResponse(
	url: string,
	response: Response,
	maxBytes: number,
): Promise<HttpResponse> {
	const body = await boundedBody(response, maxBytes);
	return new HttpResponse({
		url,
		status: response.status,
		contentType:
			response.headers.get("content-type") ?? "application/octet-stream",
		body: body.bytes,
		truncated: body.truncated,
	});
}

interface Transport {
	readonly fetch: Fetch;
	readonly resolve: HostResolver;
	readonly lookupTimeoutMs: number;
	readonly userAgent?: string;
}

// The connection goes to the checked address, so a DNS rebind between check and connect cannot move it.
async function send(
	request: HttpRequest,
	transport: Transport,
	signal: AbortSignal,
): Promise<HttpResponse | Refusal> {
	const url = parseTarget(request.url, httpsOn443);
	if (isRefusal(url)) return url;
	const hostname = bareHostname(url);
	const address = await publicAddress(
		hostname,
		transport.resolve,
		transport.lookupTimeoutMs,
	);
	if (typeof address !== "string") return address;
	const pinned = new URL(url);
	pinned.hostname = isIP(address) === 6 ? `[${address}]` : address;
	const byName = isIP(hostname) === 0;
	try {
		const response = await transport.fetch(pinned.toString(), {
			method: request.method,
			headers: {
				...withoutTransportHeaders(request.headers),
				...(byName && { host: url.host }),
			},
			...(request.body !== undefined && { body: request.body }),
			redirect: "manual",
			signal: AbortSignal.any([AbortSignal.timeout(request.timeoutMs), signal]),
			// The certificate is still checked against the name, not the address.
			...(byName && { tls: { serverName: hostname } }),
		});
		return await toHttpResponse(
			request.url,
			response,
			request.maxResponseBytes,
		);
	} catch (error) {
		return failure(error, url, request.timeoutMs);
	}
}

function redirectLocation(response: Response, base: URL): string | null {
	if (response.status < 300 || response.status >= 400) return null;
	const location = response.headers.get("location");
	return location === null ? null : new URL(location, base).toString();
}

// Each redirect hop is checked again: followed blindly, one is an open door to the internal network.
async function get(
	request: HttpRequest,
	transport: Transport,
	signal: AbortSignal,
): Promise<HttpResponse | Refusal> {
	const headers = {
		...(transport.userAgent !== undefined && {
			"user-agent": transport.userAgent,
		}),
		...withoutTransportHeaders(request.headers),
	};
	let current = request.url;
	for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
		const url = parseTarget(current, webPort);
		if (isRefusal(url)) return url;
		const address = await publicAddress(
			bareHostname(url),
			transport.resolve,
			transport.lookupTimeoutMs,
		);
		if (typeof address !== "string") return address;
		let response: Response;
		try {
			response = await transport.fetch(url.toString(), {
				headers,
				redirect: "manual",
				signal: AbortSignal.any([
					AbortSignal.timeout(request.timeoutMs),
					signal,
				]),
			});
		} catch (error) {
			return failure(error, url, request.timeoutMs);
		}
		const next = redirectLocation(response, url);
		if (next === null) {
			try {
				return await toHttpResponse(
					current,
					response,
					request.maxResponseBytes,
				);
			} catch (error) {
				return failure(error, url, request.timeoutMs);
			}
		}
		await response.body?.cancel().catch(() => undefined);
		current = next;
	}
	return refuse(`more than ${MAX_REDIRECTS} redirects from ${request.url}`);
}

/**
 * An {@link HttpService} for URLs that users or partners supply: only public
 * addresses are reached, never loopback, the private network or cloud metadata.
 * A GET follows up to three redirects over http(s), checking each hop; any
 * other method goes over https on 443 to the address that was checked, and its
 * redirects come back as they are.
 */
export function guardedHttp(options: GuardedHttpOptions = {}) {
	const resolve = options.resolve ?? resolveWithDns;
	const lookupTimeoutMs = options.lookupTimeoutMs ?? DEFAULT_LOOKUP_TIMEOUT_MS;
	const chooseFetch =
		options.fetch ?? (() => Effect.succeed<Fetch>(globalFetch));
	return Layer.succeed(HttpService, {
		send: (request) =>
			Effect.flatMap(chooseFetch(request), (fetchFunction) => {
				const transport: Transport = {
					fetch: fetchFunction,
					resolve,
					lookupTimeoutMs,
					...(options.userAgent !== undefined && {
						userAgent: options.userAgent,
					}),
				};
				return Effect.tryPromise({
					try: (signal) =>
						request.method === "GET"
							? get(request, transport, signal)
							: send(request, transport, signal),
					catch: (error) =>
						new HttpError({ reason: "network", message: String(error) }),
				});
			}).pipe(
				Effect.flatMap((settled) =>
					settled instanceof HttpResponse
						? Effect.succeed(settled)
						: Effect.fail(new HttpError(settled)),
				),
			),
	});
}
