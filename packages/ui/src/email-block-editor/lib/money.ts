import type { EmailEditorMoney } from "#/email-block-editor/document/types.ts";

/** EUR has two decimals, and it is the only currency the platform transacts
 * in; widening this means mirroring the domain's `currencyDecimals`. */
export const MINOR_UNITS_PER_UNIT = 100;

/** `2550` → `"25.50"`, and back. The field holds major units because that is
 * what an author types; the document only ever stores the integer. */
export function moneyToInputValue(money: EmailEditorMoney): string {
	return money.amountInMinorUnits === 0
		? ""
		: (money.amountInMinorUnits / MINOR_UNITS_PER_UNIT).toString();
}

export function inputValueToMinorUnits(value: string): number {
	const parsed = Number.parseFloat(value.replace(",", "."));
	return Number.isFinite(parsed)
		? Math.round(parsed * MINOR_UNITS_PER_UNIT)
		: 0;
}

/**
 * How a price reads on the canvas, in the theme's preview locale rather than
 * the browser's. The sent email formats it per recipient, so an author should
 * never see an amount their reader will not get.
 */
export function formatPreviewPrice(
	money: EmailEditorMoney,
	locale: string,
): string {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: money.currency,
	}).format(money.amountInMinorUnits / MINOR_UNITS_PER_UNIT);
}
