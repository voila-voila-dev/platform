import { Effect, Layer } from "effect";
import { SecureRandomService } from "#core/services/secure-random-service";

function randomBytes(length: number): Uint8Array {
	return crypto.getRandomValues(new Uint8Array(length));
}

function randomToken(byteLength: number): string {
	return Buffer.from(randomBytes(byteLength)).toString("base64url");
}

function randomDigitCode(length: number): string {
	const digits: Array<number> = [];
	while (digits.length < length) {
		for (const byte of randomBytes(length * 2)) {
			if (byte < 250 && digits.length < length) digits.push(byte % 10);
		}
	}
	return digits.join("");
}

export const webCryptoSecureRandom = Layer.succeed(SecureRandomService, {
	digitCode: (length) => Effect.sync(() => randomDigitCode(length)),
	token: (byteLength) => Effect.sync(() => randomToken(byteLength)),
});
