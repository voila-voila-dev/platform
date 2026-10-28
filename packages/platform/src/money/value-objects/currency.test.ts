import { describe, expect, it } from "bun:test";
import { currencyDecimals } from "#money/value-objects/currency";

describe("currencyDecimals", () => {
	it("is the ISO 4217 minor-unit exponent", () => {
		expect(currencyDecimals("EUR")).toBe(2);
		expect(currencyDecimals("JPY")).toBe(0);
		expect(currencyDecimals("KWD")).toBe(3);
	});
});
