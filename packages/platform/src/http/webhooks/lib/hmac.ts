import { utf8Bytes } from "#security/lib/utf8";

/** HMAC of `content` keyed with `secret` (its UTF-8 bytes when a string). SHA-1 exists for Twilio, which still signs with it. */
export async function hmac(
	secret: string | Uint8Array<ArrayBuffer>,
	content: string,
	hash: "SHA-256" | "SHA-1" = "SHA-256",
): Promise<ArrayBuffer> {
	const key = await crypto.subtle.importKey(
		"raw",
		typeof secret === "string" ? utf8Bytes(secret) : secret,
		{ name: "HMAC", hash },
		false,
		["sign"],
	);
	return crypto.subtle.sign("HMAC", key, utf8Bytes(content));
}
