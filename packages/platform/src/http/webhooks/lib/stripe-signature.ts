import { hmac } from "#http/webhooks/lib/hmac";
import { isTimestampWithinTolerance } from "#http/webhooks/lib/timestamp-tolerance";
import { constantTimeEquals } from "#security/lib/constant-time-equals";
import { hexFromBytes } from "#security/lib/hex";

interface StripeSignatureHeader {
	readonly timestamp: string;
	readonly signatures: ReadonlyArray<string>;
}

function parseHeader(header: string): StripeSignatureHeader | undefined {
	let timestamp: string | undefined;
	const signatures: Array<string> = [];
	for (const part of header.split(",")) {
		const separator = part.indexOf("=");
		if (separator < 0) continue;
		const key = part.slice(0, separator).trim();
		const value = part.slice(separator + 1).trim();
		if (key === "t") timestamp = value;
		if (key === "v1") signatures.push(value);
	}
	return timestamp === undefined || signatures.length === 0
		? undefined
		: { timestamp, signatures };
}

/**
 * Checks a Stripe webhook's `Stripe-Signature` header against the raw body.
 * The header is `t=<timestamp>,v1=<hex>[,v1=…]` (several `v1` during a secret
 * rotation) and each `v1` is `HMAC-SHA256(secret, "<t>.<body>")`.
 *
 * False on a missing or malformed header, an empty secret (an unconfigured
 * environment must refuse, not accept), a timestamp outside the window, or a
 * mismatch; it never throws, so a hostile body cannot become a 500.
 */
export async function verifyStripeSignature(input: {
	readonly payload: string;
	readonly header: string | undefined;
	readonly secret: string;
	readonly nowSeconds: number;
	readonly toleranceSeconds?: number;
}): Promise<boolean> {
	if (input.header === undefined || input.secret.length === 0) return false;
	const header = parseHeader(input.header);
	if (header === undefined) return false;
	if (
		!isTimestampWithinTolerance({
			timestamp: header.timestamp,
			nowSeconds: input.nowSeconds,
			toleranceSeconds: input.toleranceSeconds,
		})
	) {
		return false;
	}
	const expected = hexFromBytes(
		await hmac(input.secret, `${header.timestamp}.${input.payload}`),
	);
	return header.signatures.some((candidate) =>
		constantTimeEquals(candidate, expected),
	);
}
