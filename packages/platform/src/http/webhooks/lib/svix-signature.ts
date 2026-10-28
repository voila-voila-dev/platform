import { hmac } from "#http/webhooks/lib/hmac";
import { isTimestampWithinTolerance } from "#http/webhooks/lib/timestamp-tolerance";
import { base64FromBytes, bytesFromBase64 } from "#security/lib/base64";
import { constantTimeEquals } from "#security/lib/constant-time-equals";

/** The `svix-id`, `svix-timestamp` and `svix-signature` headers. */
export interface SvixSignatureHeaders {
	readonly id: string | undefined;
	readonly timestamp: string | undefined;
	readonly signature: string | undefined;
}

// `v1,<sig> v1,<sig>`: several entries are the normal shape during a rotation, and accepting any of them is the point.
function signaturesOf(header: string): ReadonlyArray<string> {
	const signatures: Array<string> = [];
	for (const entry of header.split(" ")) {
		const separator = entry.indexOf(",");
		if (separator >= 0 && separator < entry.length - 1) {
			signatures.push(entry.slice(separator + 1));
		}
	}
	return signatures;
}

/**
 * Checks a webhook delivered through Svix (Resend, Clerk and others use it)
 * against the raw body: `HMAC-SHA256` of `"<id>.<timestamp>.<body>"`, base64.
 *
 * The secret arrives as `whsec_<base64>` and it is the decoded bytes that key
 * the HMAC; keying with the literal string is the mistake that makes every
 * check fail while looking entirely reasonable. False on anything missing,
 * malformed, stale or mismatched; it never throws.
 */
export async function verifySvixSignature(input: {
	readonly payload: string;
	readonly headers: SvixSignatureHeaders;
	readonly secret: string;
	readonly nowSeconds: number;
	readonly toleranceSeconds?: number;
}): Promise<boolean> {
	const { id, timestamp, signature } = input.headers;
	if (
		input.secret.length === 0 ||
		id === undefined ||
		timestamp === undefined ||
		signature === undefined
	) {
		return false;
	}
	if (
		!isTimestampWithinTolerance({
			timestamp,
			nowSeconds: input.nowSeconds,
			toleranceSeconds: input.toleranceSeconds,
		})
	) {
		return false;
	}
	const key = bytesFromBase64(
		input.secret.startsWith("whsec_") ? input.secret.slice(6) : input.secret,
	);
	if (key === null) return false;
	const expected = base64FromBytes(
		await hmac(key, `${id}.${timestamp}.${input.payload}`),
	);
	return signaturesOf(signature).some((candidate) =>
		constantTimeEquals(candidate, expected),
	);
}
