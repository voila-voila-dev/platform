import { Effect, Redacted } from "effect";
import { hexFromBytes } from "#security/lib/hex";
import { utf8Bytes } from "#security/lib/utf8";
import { TokenDigest } from "#security/value-objects/token-digest";

// What a table stores in place of a session token, an API key or a one-time
// code, so a leaked dump yields no usable credential. Unsalted SHA-256 is
// enough because the input is a high-entropy random token (or a short code
// behind a rate limit), never a password, which needs a slow salted hash.
export function tokenDigest(
	token: string | Redacted.Redacted<string>,
): Effect.Effect<TokenDigest> {
	const value = Redacted.isRedacted(token) ? Redacted.value(token) : token;
	return Effect.promise(async () =>
		TokenDigest.make(
			hexFromBytes(await crypto.subtle.digest("SHA-256", utf8Bytes(value))),
		),
	);
}
