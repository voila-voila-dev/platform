import { describe, expect, it } from "bun:test";
import { Config, Effect, Redacted } from "effect";
import {
	aesGcmSecretBox,
	makeAesGcmSecretBox,
} from "#security/adapters/bun/aes-gcm-secret-box";
import { SecretBoxService } from "#security/services/secret-box-service";

const key = new Uint8Array(32).fill(7);

function withBox<A, E>(
	use: (box: typeof SecretBoxService.Service) => Effect.Effect<A, E>,
) {
	return Effect.runPromise(Effect.flatMap(makeAesGcmSecretBox(key), use));
}

describe("makeAesGcmSecretBox", () => {
	it("opens what it sealed, with a fresh nonce each time", async () => {
		const [first, second, opened] = await withBox((box) =>
			Effect.gen(function* () {
				const first = yield* box.seal("api-key", "row-1");
				const second = yield* box.seal("api-key", "row-1");
				return [first, second, yield* box.open(first, "row-1")];
			}),
		);
		expect(first).toStartWith("v1.");
		expect(first).not.toBe(second);
		expect(opened).toBe("api-key");
	});

	it("refuses a text bound to another record, altered or malformed", async () => {
		const reasons = await withBox((box) =>
			Effect.gen(function* () {
				const sealed = yield* box.seal("api-key", "row-1");
				const altered = `${sealed.slice(0, -2)}${sealed.endsWith("AA") ? "BB" : "AA"}`;
				return yield* Effect.forEach(
					[
						box.open(sealed, "row-2"),
						box.open(altered, "row-1"),
						box.open("v1.nope", "row-1"),
						box.open(`v2${sealed.slice(2)}`, "row-1"),
					],
					(open) => Effect.map(Effect.flip(open), (error) => error.reason),
				);
			}),
		);
		expect(reasons).toEqual([
			"unreadable",
			"unreadable",
			"unreadable",
			"unreadable",
		]);
	});

	it("dies on a key that is not 32 bytes", async () => {
		const exit = await Effect.runPromiseExit(
			makeAesGcmSecretBox(new Uint8Array(16)),
		);
		expect(exit._tag).toBe("Failure");
	});
});

describe("aesGcmSecretBox", () => {
	it("reads its key from configuration in base64", async () => {
		const layer = aesGcmSecretBox(
			Config.succeed(Redacted.make(Buffer.from(key).toString("base64"))),
		);
		const opened = await Effect.runPromise(
			Effect.gen(function* () {
				const box = yield* SecretBoxService;
				return yield* box.open(yield* box.seal("token", "row-1"), "row-1");
			}).pipe(Effect.provide(layer)),
		);
		expect(opened).toBe("token");
	});
});
