import { describe, expect, it } from "bun:test";
import { Option } from "effect";
import { moneyInput, parseMoneyInput } from "#money/lib/money-input";

function parsed(text: string, currency: "EUR" | "JPY" | "KWD" = "EUR") {
	return Option.getOrNull(parseMoneyInput(text, currency));
}

describe("parseMoneyInput", () => {
	it("reads whole and decimal amounts as minor units", () => {
		expect(parsed("120")).toBe(12_000);
		expect(parsed("2.14")).toBe(214);
		expect(parsed("0.05")).toBe(5);
		expect(parsed("2.1")).toBe(210);
	});

	it("accepts the comma separator and grouping spaces", () => {
		expect(parsed("2,14")).toBe(214);
		expect(parsed(" 1 234,50 ")).toBe(123_450);
		expect(parsed("1 234,50")).toBe(123_450);
	});

	it("stays exact where scaling a float would not", () => {
		expect(parsed("1.15")).toBe(115);
		expect(parsed("8.85")).toBe(885);
	});

	it("follows the currency's decimals", () => {
		expect(parsed("1500", "JPY")).toBe(1500);
		expect(parsed("15.5", "JPY")).toBeNull();
		expect(parsed("1.234", "KWD")).toBe(1234);
	});

	it("rejects anything that is not an amount", () => {
		for (const text of ["", "   ", "abc", "1.234", "1.2.3", "-5", "1e3"])
			expect(parseMoneyInput(text, "EUR")).toStrictEqual(Option.none());
	});
});

describe("moneyInput", () => {
	it("renders minor units with the currency's decimals", () => {
		expect(moneyInput(214, "EUR")).toBe("2.14");
		expect(moneyInput(0, "EUR")).toBe("0.00");
		expect(moneyInput(1500, "JPY")).toBe("1500");
	});

	it("round-trips through the parser", () => {
		expect(parsed(moneyInput(123_456, "EUR"))).toBe(123_456);
	});
});
