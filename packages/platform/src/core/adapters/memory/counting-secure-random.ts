import { Effect, Layer } from "effect";
import { SecureRandomService } from "#core/services/secure-random-service";

export function countingSecureRandom(
	options: { readonly prefix?: string } = {},
) {
	const prefix = options.prefix ?? "token-";
	let counter = 0;
	return Layer.succeed(SecureRandomService, {
		digitCode: (length) =>
			Effect.sync(() => {
				counter += 1;
				return String(counter).padStart(length, "0").slice(-length);
			}),
		token: () =>
			Effect.sync(() => {
				counter += 1;
				return `${prefix}${counter}`;
			}),
	});
}
