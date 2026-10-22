import { describe, expect, it } from "bun:test";
import { formatMoney, formatMoneyAmount } from "#money/lib/format-money";
import { Money } from "#money/value-objects/money";

describe("formatMoney", () => {
	it("formats minor units in the locale, with the currency's decimals", () => {
		expect(
			formatMoney(Money.make({ amount: 2550, currency: "EUR" }), "fr-FR"),
		).toBe("25,50 €");
		expect(formatMoneyAmount(2550, "EUR", "en-US")).toBe("€25.50");
		expect(formatMoneyAmount(1500, "JPY", "en-US")).toBe("¥1,500");
	});
});
