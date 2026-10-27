import { DateTime } from "effect";
import { type Fetch, globalFetch } from "#http/lib/fetch";
import type { RecordedRequest } from "#http/value-objects/recorded-request";
import { requestOutcome } from "#http/value-objects/request-outcome";
import { hexFromBytes } from "#security/lib/hex";
import { redactPii } from "#security/lib/redact-pii";

// Runs on the caller's request path, so it must neither throw nor wait; one
// writing to a database buffers and flushes off that path.
export interface RequestRecorder {
	readonly record: (request: RecordedRequest) => void;
}

export interface RecordingOptions {
	readonly base?: Fetch;
	// False for a partner whose error bodies may echo a credential (a host a
	// user typed, with a key they entered): the body is never read and a thrown
	// error keeps only its class.
	readonly readFailureBody?: boolean;
	// Masks what a path itself carries as a secret, such as a webhook URL's token.
	readonly redactPath?: (path: string) => string;
	readonly redactFailure?: (text: string) => string;
	readonly makeId?: () => string;
}

const PROVIDER_REQUEST_ID_HEADERS = [
	"request-id",
	"x-request-id",
	"x-amzn-requestid",
	"cf-ray",
] as const;

const FAILURE_LENGTH_LIMIT = 1000;

// A row id needs only to be unique, never ordered: a recorder that wants sortable ids passes its own.
function randomRequestId(): string {
	return hexFromBytes(crypto.getRandomValues(new Uint8Array(16)));
}

interface Observation {
	readonly status: number | null;
	readonly failure: string | null;
	readonly providerRequestId: string | null;
}

function urlOf(input: string | URL | Request): URL {
	return new URL(input instanceof Request ? input.url : input.toString());
}

// The URL parser normalizes every IPv4 spelling to dotted form and brackets IPv6.
function isAddressLiteral(hostname: string): boolean {
	return hostname.startsWith("[") || /^\d+\.\d+\.\d+\.\d+$/u.test(hostname);
}

// A request pinned to an address names its partner in the Host header.
function hostOf(url: URL, init: RequestInit | undefined): string {
	return isAddressLiteral(url.hostname)
		? (new Headers(init?.headers).get("host") ?? url.host)
		: url.host;
}

function methodOf(
	input: string | URL | Request,
	init: RequestInit | undefined,
): string {
	return (
		init?.method ?? (input instanceof Request ? input.method : "GET")
	).toUpperCase();
}

function providerRequestIdOf(headers: Headers): string | null {
	for (const name of PROVIDER_REQUEST_ID_HEADERS) {
		const value = headers.get(name);
		if (value !== null) return value;
	}
	return null;
}

function describeThrown(error: unknown): string {
	return error instanceof Error
		? `${error.name}: ${error.message}`
		: String(error);
}

// The response goes back untouched and a thrown error is rethrown as is:
// recording never changes what the caller sees, and a recorder that throws
// costs a row, never the call.
export function recordingFetch(
	partner: string,
	recorder: RequestRecorder,
	options: RecordingOptions = {},
): Fetch {
	const base = options.base ?? globalFetch;
	const readFailureBody = options.readFailureBody ?? true;
	const redactPath = options.redactPath ?? ((path) => path);
	const redactFailure = options.redactFailure ?? redactPii;
	const makeId = options.makeId ?? randomRequestId;
	function trimmed(text: string) {
		return redactFailure(text.slice(0, FAILURE_LENGTH_LIMIT));
	}

	return async (input, init) => {
		const startedAt = DateTime.nowUnsafe();
		const started = performance.now();
		function observe(observation: Observation, elapsedMilliseconds: number) {
			try {
				const url = urlOf(input);
				recorder.record({
					id: makeId(),
					partner,
					method: methodOf(input, init),
					host: hostOf(url, init),
					path: redactPath(url.pathname),
					outcome: requestOutcome(observation.status),
					durationMilliseconds: Math.round(elapsedMilliseconds),
					startedAt,
					...observation,
				});
			} catch {
				// A request we cannot describe is one row missing from the log, never a failed call.
			}
		}

		let response: Response;
		try {
			response = await base(input, init);
		} catch (error) {
			const failure = readFailureBody
				? trimmed(describeThrown(error))
				: error instanceof Error
					? error.name
					: "Error";
			observe(
				{ status: null, failure, providerRequestId: null },
				performance.now() - started,
			);
			throw error;
		}
		const elapsed = performance.now() - started;
		const providerRequestId = providerRequestIdOf(response.headers);
		if (response.status < 400 || !readFailureBody) {
			observe(
				{
					status: response.status,
					failure: response.status < 400 ? null : `HTTP ${response.status}`,
					providerRequestId,
				},
				elapsed,
			);
			return response;
		}
		// Read off a clone, after the caller has its response: the log never delays the call.
		void response
			.clone()
			.text()
			.then(trimmed, describeThrown)
			.then((failure) =>
				observe(
					{ status: response.status, failure, providerRequestId },
					elapsed,
				),
			);
		return response;
	};
}
