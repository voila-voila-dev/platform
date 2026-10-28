import { Effect, Layer } from "effect";
import { HashService } from "#security/services/hash-service";
import { Sha256Hex } from "#security/value-objects/sha256-hex";

const encoder = new TextEncoder();

// FNV-1a repeated to 64 hex digits: shaped like a SHA-256, cheap, not one.
function fnv1aHex(bytes: Uint8Array): Sha256Hex {
	let hash = 0x81_1c_9d_c5;
	for (const byte of bytes) {
		hash = Math.imul(hash ^ byte, 0x01_00_01_93) >>> 0;
	}
	return Sha256Hex.make(hash.toString(16).padStart(8, "0").repeat(8));
}

export const stubHashService = Layer.succeed(HashService, {
	sha256: (value) => Effect.sync(() => fnv1aHex(encoder.encode(value))),
	sha256Bytes: (bytes) => Effect.sync(() => fnv1aHex(bytes)),
});
