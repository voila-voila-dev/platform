import { describe, expect, it } from "bun:test";
import { constantTimeEquals } from "#security/lib/constant-time-equals";

describe("constantTimeEquals", () => {
	it("matches only identical strings", () => {
		expect(constantTimeEquals("abc", "abc")).toBe(true);
		expect(constantTimeEquals("abc", "abd")).toBe(false);
		expect(constantTimeEquals("abc", "ab")).toBe(false);
		expect(constantTimeEquals("", "")).toBe(true);
	});
});
