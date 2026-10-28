import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { bunHashService } from "#security/adapters/bun/bun-hash-service";
import { HashService } from "#security/services/hash-service";

describe("bunHashService", () => {
	it("hashes text and bytes to the same SHA-256", async () => {
		const [text, bytes] = await Effect.runPromise(
			Effect.gen(function* () {
				const hash = yield* HashService;
				return [
					yield* hash.sha256("abc"),
					yield* hash.sha256Bytes(new TextEncoder().encode("abc")),
				];
			}).pipe(Effect.provide(bunHashService)),
		);
		expect<string>(text).toBe(
			"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
		);
		expect(bytes).toBe(text);
	});
});
