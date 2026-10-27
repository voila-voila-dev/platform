import { describe, expect, it } from "bun:test";
import { hexFromBytes } from "#security/lib/hex";

describe("hexFromBytes", () => {
	it("hex-encodes every byte, zero-padded", () => {
		expect(hexFromBytes(new Uint8Array([0, 1, 15, 16, 255]))).toBe(
			"00010f10ff",
		);
	});

	it("reads an ArrayBuffer like a view over it", () => {
		const bytes = new Uint8Array([171, 205]);
		expect(hexFromBytes(bytes.buffer)).toBe(hexFromBytes(bytes));
	});
});
