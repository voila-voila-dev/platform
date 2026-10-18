import { Effect, Layer } from "effect";
import { SecureRandom } from "#core/services/secure-random";

export function countingSecureRandom(
	options: { readonly prefix?: string } = {},
) {
	const prefix = options.prefix ?? "token-";
	let counter = 0;
	return Layer.succeed(SecureRandom, {
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
