---
"@voila.dev/platform": minor
---

New `security` brick: `/security` (`HashService`, `Sha256Hex`, `SecretBoxService`, `SecretBoxError`, `redactPii`, `redactSecrets`, `REDACTED_SECRET`), `/security/bun` (`bunHashService`, `aesGcmSecretBox`, `makeAesGcmSecretBox`, `AES_GCM_KEY_BYTES`; sealed texts are wire-compatible with `@voila.dev/crypto`) and `/security/memory` (`plainSecretBox`, `plainSealed`, `unavailableSecretBox`, `stubHashService`).
