import { hmac } from "#http/webhooks/lib/hmac";
import { base64FromBytes } from "#security/lib/base64";
import { constantTimeEquals } from "#security/lib/constant-time-equals";

/** The POST parameters of a Twilio callback, as parsed from its form body. */
export type TwilioParams = URLSearchParams | Readonly<Record<string, string>>;

function entriesOf(params: TwilioParams): ReadonlyArray<[string, string]> {
	return params instanceof URLSearchParams
		? [...params.entries()]
		: Object.entries(params);
}

/** Twilio's scheme: the URL as requested, then every parameter as `key + value` in key order, no separator. */
function signedContent(url: string, params: TwilioParams): string {
	return (
		url +
		entriesOf(params)
			.toSorted(
				([left], [right]) => Number(left > right) - Number(left < right),
			)
			.map(([key, value]) => key + value)
			.join("")
	);
}

/** The `X-Twilio-Signature` Twilio would send for this request: base64 HMAC-SHA1 keyed with the auth token. */
export async function twilioSignature(input: {
	readonly url: string;
	readonly params: TwilioParams;
	readonly authToken: string;
}): Promise<string> {
	return base64FromBytes(
		await hmac(
			input.authToken,
			signedContent(input.url, input.params),
			"SHA-1",
		),
	);
}

// Twilio sometimes signs the URL with its default port spelled out
// (`https://host:443/path`), so both spellings are candidates, as its own
// helper libraries do.
function urlVariants(url: string): ReadonlyArray<string> {
	const parsed = new URL(url);
	if (parsed.port.length > 0) {
		parsed.port = "";
		return [url, parsed.toString()];
	}
	const defaultPort = parsed.protocol === "https:" ? "443" : "80";
	return [
		url,
		`${parsed.protocol}//${parsed.host}:${defaultPort}${parsed.pathname}${parsed.search}`,
	];
}

/**
 * Checks a Twilio callback's `X-Twilio-Signature`. `url` is the full URL
 * Twilio requested, query string included, as configured on its side. False
 * on a missing header, an empty token (an unconfigured environment must
 * refuse every call) or an unparseable URL; it never throws.
 */
export async function verifyTwilioSignature(input: {
	readonly url: string;
	readonly params: TwilioParams;
	readonly authToken: string;
	readonly signature: string | undefined;
}): Promise<boolean> {
	const { signature } = input;
	if (signature === undefined || input.authToken.length === 0) return false;
	let urls: ReadonlyArray<string>;
	try {
		urls = urlVariants(input.url);
	} catch {
		return false;
	}
	const expected = await Promise.all(
		urls.map((url) => twilioSignature({ ...input, url })),
	);
	return expected.some((candidate) => constantTimeEquals(signature, candidate));
}
