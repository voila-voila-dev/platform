import { Option } from "effect";
import { type Currency, currencyDecimals } from "#money/value-objects/currency";

const SPACES = /[\s  ]/gu;

// A typed amount → minor units, read digit by digit: `2.14 × 100` would be 213.99….
// Negative amounts are refused: an operation carries its direction, not the sign.
export function parseMoneyInput(
	text: string,
	currency: Currency,
): Option.Option<number> {
	const decimals = currencyDecimals(currency);
	const normalized = text.replace(SPACES, "").replace(",", ".");
	const pattern =
		decimals === 0
			? /^\d+$/u
			: new RegExp(`^\\d+(?:\\.\\d{1,${decimals}})?$`, "u");
	if (!pattern.test(normalized)) return Option.none();
	const [whole = "", fraction = ""] = normalized.split(".");
	return Option.some(
		Number(whole) * 10 ** decimals + Number(fraction.padEnd(decimals, "0")),
	);
}

// What a money input shows: `214` EUR → `"2.14"`.
export function moneyInput(amount: number, currency: Currency): string {
	const decimals = currencyDecimals(currency);
	return (amount / 10 ** decimals).toFixed(decimals);
}
