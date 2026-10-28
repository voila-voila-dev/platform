import { Effect, Layer } from "effect";
import { SecretBoxError } from "#security/errors/secret-box-error";
import { SecretBoxService } from "#security/services/secret-box-service";

/** What `plainSecretBox` stores, so a test can plant a sealed value or read what a use case stored. */
export function plainSealed(plaintext: string, boundTo: string): string {
	return `sealed:${boundTo}:${plaintext}`;
}

// Still refuses a text bound to another record, so the binding stays tested.
export const plainSecretBox = Layer.succeed(SecretBoxService, {
	seal: (plaintext, boundTo) => Effect.succeed(plainSealed(plaintext, boundTo)),
	open: (sealed, boundTo) => {
		const prefix = plainSealed("", boundTo);
		return sealed.startsWith(prefix)
			? Effect.succeed(sealed.slice(prefix.length))
			: Effect.fail(new SecretBoxError({ reason: "unreadable" }));
	},
});
