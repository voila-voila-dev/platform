import { Effect, Layer } from "effect";
import { HashService } from "#security/services/hash-service";
import { Sha256Hex } from "#security/value-objects/sha256-hex";

function sha256(value: string | Uint8Array): Sha256Hex {
	return Sha256Hex.make(
		new Bun.CryptoHasher("sha256").update(value).digest("hex"),
	);
}

export const bunHashService = Layer.succeed(HashService, {
	sha256: (value) => Effect.sync(() => sha256(value)),
	sha256Bytes: (bytes) => Effect.sync(() => sha256(bytes)),
});
