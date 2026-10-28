import { describe, expect, it } from "bun:test";
import { Effect, Schema } from "effect";
import {
	plainSealed,
	plainSecretBox,
	stubHashService,
	unavailableSecretBox,
} from "#security/adapters/memory/index";
import { HashService } from "#security/services/hash-service";
import { SecretBoxService } from "#security/services/secret-box-service";
import { Sha256Hex } from "#security/value-objects/sha256-hex";

describe("plainSecretBox", () => {
	it("seals readably and still checks the binding", async () => {
		const [sealed, opened, reason] = await Effect.runPromise(
			Effect.gen(function* () {
				const box = yield* SecretBoxService;
				const sealed = yield* box.seal("api-key", "row-1");
				return [
					sealed,
					yield* box.open(plainSealed("planted", "row-1"), "row-1"),
					(yield* Effect.flip(box.open(sealed, "row-2"))).reason,
				];
			}).pipe(Effect.provide(plainSecretBox)),
		);
		expect(sealed).toBe("sealed:row-1:api-key");
		expect(opened).toBe("planted");
		expect(reason).toBe("unreadable");
	});
});

describe("unavailableSecretBox", () => {
	it("fails every seal with missing-key", async () => {
		const error = await Effect.runPromise(
			Effect.gen(function* () {
				const box = yield* SecretBoxService;
				return yield* Effect.flip(box.seal("api-key", "row-1"));
			}).pipe(Effect.provide(unavailableSecretBox)),
		);
		expect(error.reason).toBe("missing-key");
	});
});

describe("stubHashService", () => {
	it("is deterministic and shaped like a SHA-256", async () => {
		const [first, second, other] = await Effect.runPromise(
			Effect.gen(function* () {
				const hash = yield* HashService;
				return [
					yield* hash.sha256("abc"),
					yield* hash.sha256Bytes(new TextEncoder().encode("abc")),
					yield* hash.sha256("abd"),
				];
			}).pipe(Effect.provide(stubHashService)),
		);
		expect(Schema.is(Sha256Hex)(first)).toBe(true);
		expect(second).toBe(first);
		expect(other).not.toBe(first);
	});
});
