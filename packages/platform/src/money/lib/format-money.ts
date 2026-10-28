import { type Currency, currencyDecimals } from "#money/value-objects/currency";
import type { Money } from "#money/value-objects/money";

// `Intl` places the symbol with the narrow no-break space French typography wants.
export function formatMoneyAmount(
	amount: number,
	currency: Currency,
	locale: Intl.UnicodeBCP47LocaleIdentifier,
): string {
	return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
		amount / 10 ** currencyDecimals(currency),
	);
}

export function formatMoney(
	money: Money,
	locale: Intl.UnicodeBCP47LocaleIdentifier,
): string {
	return formatMoneyAmount(money.amount, money.currency, locale);
}
