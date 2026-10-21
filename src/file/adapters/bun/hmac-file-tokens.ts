import { DateTime, Effect, Layer, Redacted } from "effect";
import { InvalidFileTokenError } from "#file/errors/invalid-file-token-error";
import { FileTokens } from "#file/services/file-tokens";

const MAC_HEX_LENGTH = 32;

const utf8 = new TextEncoder();

async function macOf(key: CryptoKey, content: string): Promise<string> {
	const signature = new Uint8Array(
		await crypto.subtle.sign("HMAC", key, utf8.encode(content)),
	);
	return Buffer.from(signature).toString("hex").slice(0, MAC_HEX_LENGTH);
}

function constantTimeEquals(left: string, right: string): boolean {
	let difference = left.length ^ right.length;
	for (let index = 0; index < right.length; index += 1)
		difference |= (left.charCodeAt(index) || 0) ^ right.charCodeAt(index);
	return difference === 0;
}

function epochSeconds(dateTime: DateTime.Utc): number {
	return Math.floor(DateTime.toEpochMillis(dateTime) / 1000);
}

export function hmacFileTokens(secret: Redacted.Redacted<string>) {
	return Layer.effect(
		FileTokens,
		Effect.map(
			Effect.promise(() =>
				crypto.subtle.importKey(
					"raw",
					utf8.encode(Redacted.value(secret)),
					{ name: "HMAC", hash: "SHA-256" },
					false,
					["sign"],
				),
			),
			(key) => ({
				mint: ({ key: fileKey, expiresAt }) =>
					Effect.promise(async () => {
						const expiry = epochSeconds(expiresAt).toString(36);
						return `f.${expiry}.${await macOf(key, `f.${fileKey}.${expiry}`)}`;
					}),
				verify: ({ key: fileKey, token }) =>
					Effect.gen(function* () {
						const [family, expiry, mac, ...rest] = token.split(".");
						if (family !== "f" || !expiry || !mac || rest.length > 0)
							return yield* new InvalidFileTokenError();
						const expected = yield* Effect.promise(() =>
							macOf(key, `f.${fileKey}.${expiry}`),
						);
						const expirySeconds = Number.parseInt(expiry, 36);
						const now = epochSeconds(yield* DateTime.now);
						// Both checks run, so a forged mac and a stale expiry take the same time.
						const authentic = constantTimeEquals(mac, expected);
						const live = Number.isFinite(expirySeconds) && expirySeconds > now;
						if (!(authentic && live)) return yield* new InvalidFileTokenError();
					}),
			}),
		),
	);
}
