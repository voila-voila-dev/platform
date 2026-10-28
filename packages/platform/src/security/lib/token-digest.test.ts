import { describe, expect, it } from "bun:test";
import { Effect, Redacted, Schema } from "effect";
import { tokenDigest } from "#security/lib/token-digest";
import { TokenDigest } from "#security/value-objects/token-digest";

describe("tokenDigest", () => {
	it("is the SHA-256 of the token in lowercase hex", async () => {
		expect(String(await Effect.runPromise(tokenDigest("abc")))).toBe(
			"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
		);
	});

	it("reads a redacted token the same as its value", async () => {
		expect(await Effect.runPromise(tokenDigest(Redacted.make("abc")))).toBe(
			await Effect.runPromise(tokenDigest("abc")),
		);
	});
});

describe("TokenDigest", () => {
	it("accepts only 64 lowercase hex characters", () => {
		const is = Schema.is(TokenDigest);
		expect(is("a".repeat(64))).toBe(true);
		expect(is("A".repeat(64))).toBe(false);
		expect(is("a".repeat(63))).toBe(false);
	});
});
