import { describe, expect, it } from "bun:test";
import { textFromUtf8, utf8Bytes } from "#security/lib/utf8";

describe("utf8", () => {
	it("round-trips text outside ASCII", () => {
		expect(textFromUtf8(utf8Bytes("déjà vu ✓"))).toBe("déjà vu ✓");
	});

	it("encodes one byte per ASCII character", () => {
		expect([...utf8Bytes("ab")]).toStrictEqual([97, 98]);
	});

	it("refuses an invalid sequence", () => {
		expect(() => textFromUtf8(new Uint8Array([0xff]))).toThrow();
	});
});
