# security

Hashing, secrets sealed at rest, and redaction before text leaves for a log or an alert.

```ts
import { HashService, SecretBoxService, redactPii } from "@voila.dev/platform/security";

const storeApiKey = (rowId: string, apiKey: string) =>
	Effect.gen(function* () {
		const box = yield* SecretBoxService;
		const sealed = yield* box.seal(apiKey, rowId);
		yield* saveSealedKey(rowId, sealed);
	});
```

- `SecretBoxService.seal(plaintext, boundTo)`: `boundTo` is the id of the record that stores it, so a sealed text copied onto another record does not open there. Failures are `SecretBoxError` (`missing-key`, `unreadable`) and never carry the value.
- `HashService` gives a `Sha256Hex` of text or bytes.
- `redactPii` masks emails, phone numbers and long digit runs (cards, social security, RPPS) as `«email»`, `«phone»`, `«id»`; it over-masks on purpose. `redactSecrets(text, secrets)` replaces known secrets with `[redacted]`.
- `/security/bun`: `bunHashService` (`Bun.CryptoHasher`), `aesGcmSecretBox(Config.Redacted(...))` for a 32-byte base64 key (`openssl rand -base64 32`), or `makeAesGcmSecretBox(bytes)` when the app decodes the key itself. The sealed text is `v1.<nonce>.<ciphertext>`, the same as `@voila.dev/crypto`'s.
- `/security/memory`: `plainSecretBox` (seals as `plainSealed(plaintext, boundTo)`), `unavailableSecretBox` (every call fails `missing-key`, for a deployment with no key), `stubHashService`.
- Random codes and tokens are core's `SecureRandomService`.
