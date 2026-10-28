import { describe, expect, it } from "vitest";
import { getInitials } from "#/user-avatar/lib/get-initials.ts";

describe("getInitials", () => {
	it("takes the first letter of the first and last words", () => {
		expect(getInitials("Camille Dubois")).toBe("CD");
		expect(getInitials("Jean-Pierre Le Goff")).toBe("JG");
	});

	it("returns a single letter for single-word names", () => {
		expect(getInitials("Camille")).toBe("C");
	});

	it("uppercases and survives extra whitespace", () => {
		expect(getInitials("  camille   dubois  ")).toBe("CD");
	});

	it("returns an empty string for empty input", () => {
		expect(getInitials("")).toBe("");
		expect(getInitials("   ")).toBe("");
	});
});
