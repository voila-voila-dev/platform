import { describe, expect, it } from "bun:test";
import { createHmac } from "node:crypto";
import { DateTime, Effect, Redacted } from "effect";
import { hmacFileTokens } from "#file/adapters/bun/hmac-file-tokens";
import { FileTokens } from "#file/services/file-tokens";
import { FileKey } from "#file/value-objects/file-key";

const SECRET = Redacted.make("files-secret");
const KEY = FileKey.make(
	"signature-request/0197c4d2-1f4a-7b31-9c8e-4d2a1f4a7b31/signed.pdf",
);

function inMinutes(minutes: number): DateTime.Utc {
	return DateTime.makeUnsafe(Date.now() + minutes * 60 * 1000);
}

function mint(key: FileKey = KEY, expiresAt = inMinutes(15), secret = SECRET) {
	return Effect.runPromise(
		Effect.flatMap(FileTokens, (tokens) =>
			tokens.mint({ key, expiresAt }),
		).pipe(Effect.provide(hmacFileTokens(secret))),
	);
}

function verify(key: FileKey, token: string) {
	return Effect.runPromise(
		Effect.flatMap(FileTokens, (tokens) => tokens.verify({ key, token })).pipe(
			Effect.as("valid" as const),
			Effect.catchTag("InvalidFileTokenError", () =>
				Effect.succeed("invalid" as const),
			),
			Effect.provide(hmacFileTokens(SECRET)),
		),
	);
}

describe("hmacFileTokens", () => {
	it("round-trips a key", async () => {
		expect(await verify(KEY, await mint())).toBe("valid");
	});

	it("mints the f.<expiry>.<mac> tokens tries.care has always minted", async () => {
		const expiresAt = DateTime.makeUnsafe(1_900_000_000_000);
		const expiry = (1_900_000_000).toString(36);
		const mac = createHmac("sha256", "files-secret")
			.update(`f.${KEY}.${expiry}`)
			.digest("hex")
			.slice(0, 32);
		expect(await mint(KEY, expiresAt)).toBe(`f.${expiry}.${mac}`);
	});

	it("accepts keys with slashes and non-ASCII segments", async () => {
		const accented = FileKey.make(
			"provider-document/user-1/pièce d'identité.pdf",
		);
		expect(await verify(accented, await mint(accented))).toBe("valid");
	});

	it("rejects a token minted for another key", async () => {
		const token = await mint(FileKey.make("invoice/other/other.pdf"));
		expect(await verify(KEY, token)).toBe("invalid");
	});

	it("rejects a token signed with another secret", async () => {
		const token = await mint(KEY, inMinutes(15), Redacted.make("other"));
		expect(await verify(KEY, token)).toBe("invalid");
	});

	it("rejects an expired token", async () => {
		expect(await verify(KEY, await mint(KEY, inMinutes(-1)))).toBe("invalid");
	});

	it("rejects a token with a tampered expiry", async () => {
		const [family, , mac] = (await mint(KEY, inMinutes(-1))).split(".");
		const extended = Math.floor(Date.now() / 1000 + 3600).toString(36);
		expect(await verify(KEY, `${family}.${extended}.${mac}`)).toBe("invalid");
	});

	it.each([
		["empty", ""],
		["wrong family", "s.abc123.deadbeef"],
		["missing mac", "f.abc123."],
		["missing expiry", "f..deadbeef"],
		["extra segment", "f.abc123.deadbeef.extra"],
		["not a token", "signed.pdf"],
	])("rejects a malformed token (%s)", async (_label, token) => {
		expect(await verify(KEY, token)).toBe("invalid");
	});
});
