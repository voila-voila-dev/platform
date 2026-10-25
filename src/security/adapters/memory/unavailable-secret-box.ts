import { Effect, Layer } from "effect";
import { SecretBoxError } from "#security/errors/secret-box-error";
import { SecretBoxService } from "#security/services/secret-box-service";

const missing = new SecretBoxError({ reason: "missing-key" });

// For a deployment where secrets are optional: only the features that need one fail.
export const unavailableSecretBox = Layer.succeed(SecretBoxService, {
	seal: () => Effect.fail(missing),
	open: () => Effect.fail(missing),
});
