import { type Config, Effect, Layer, Redacted } from "effect";
import { SecretBoxError } from "#security/errors/secret-box-error";
import { base64FromBytes, bytesFromBase64 } from "#security/lib/base64";
import { textFromUtf8, utf8Bytes } from "#security/lib/utf8";
import { SecretBoxService } from "#security/services/secret-box-service";

export const AES_GCM_KEY_BYTES = 32;
const NONCE_BYTES = 12;
// Bumped with the key or the cipher, so a sealed value always says how to open it.
const FORMAT = "v1";

const unreadable = new SecretBoxError({ reason: "unreadable" });

/**
 * AES-256-GCM through Web Crypto: the sealed text is `v1.<nonce>.<ciphertext>`
 * in standard base64, with a fresh 12-byte nonce per value and `boundTo` as the
 * associated data. Same format as `@voila.dev/crypto`'s secret box.
 *
 * The nonce comes from Web Crypto, not from `SecureRandomService`: a
 * predictable source swapped in by a test must never repeat a GCM nonce under a real key.
 */
export function makeAesGcmSecretBox(
	key: Uint8Array<ArrayBuffer>,
): Effect.Effect<typeof SecretBoxService.Service> {
	if (key.byteLength !== AES_GCM_KEY_BYTES) {
		return Effect.die(
			new RangeError(
				`an AES-GCM secret box key is ${AES_GCM_KEY_BYTES} bytes, not ${key.byteLength}`,
			),
		);
	}
	return Effect.map(
		Effect.promise(() =>
			crypto.subtle.importKey("raw", key, "AES-GCM", false, [
				"encrypt",
				"decrypt",
			]),
		),
		(cryptoKey) => ({
			seal: (plaintext, boundTo) =>
				Effect.promise(async () => {
					const nonce = crypto.getRandomValues(new Uint8Array(NONCE_BYTES));
					const ciphertext = await crypto.subtle.encrypt(
						{ name: "AES-GCM", iv: nonce, additionalData: utf8Bytes(boundTo) },
						cryptoKey,
						utf8Bytes(plaintext),
					);
					return `${FORMAT}.${base64FromBytes(nonce)}.${base64FromBytes(ciphertext)}`;
				}),
			open: (sealed, boundTo) => {
				const [format, nonce, ciphertext, ...rest] = sealed.split(".");
				const nonceBytes = nonce === undefined ? null : bytesFromBase64(nonce);
				const ciphertextBytes =
					ciphertext === undefined ? null : bytesFromBase64(ciphertext);
				if (
					format !== FORMAT ||
					rest.length > 0 ||
					nonceBytes?.byteLength !== NONCE_BYTES ||
					ciphertextBytes === null
				) {
					return Effect.fail(unreadable);
				}
				return Effect.tryPromise({
					try: async () =>
						textFromUtf8(
							new Uint8Array(
								await crypto.subtle.decrypt(
									{
										name: "AES-GCM",
										iv: nonceBytes,
										additionalData: utf8Bytes(boundTo),
									},
									cryptoKey,
									ciphertextBytes,
								),
							),
						),
					catch: () => unreadable,
				});
			},
		}),
	);
}

/** Keyed from configuration, 32 random bytes in base64 (`openssl rand -base64 32`); a malformed key stops the layer at boot. */
export function aesGcmSecretBox(
	key: Config.Config<Redacted.Redacted>,
): Layer.Layer<SecretBoxService, Config.ConfigError> {
	return Layer.effect(
		SecretBoxService,
		Effect.gen(function* () {
			const bytes = bytesFromBase64(Redacted.value(yield* key));
			if (bytes === null) {
				return yield* Effect.die(
					new TypeError("the AES-GCM secret box key is not base64"),
				);
			}
			return yield* makeAesGcmSecretBox(bytes);
		}),
	);
}
