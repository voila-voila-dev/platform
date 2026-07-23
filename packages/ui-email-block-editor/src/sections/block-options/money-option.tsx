import { MoneyInput } from "@voila.dev/ui/components/money-input";
import { useId } from "react";
import type { EmailEditorMoney } from "#/document/types.ts";
import { BlockOptionRow } from "#/sections/block-options/block-option-row.tsx";
import { EMAIL_PREVIEW_LOCALE } from "#/theme.ts";

/** EUR has two decimals, and it is the only currency the platform transacts
 * in; widening this means mirroring the domain's `currencyDecimals`. */
const MINOR_UNITS_PER_UNIT = 100;

/** `2550` → `"25.50"`, and back. The field holds major units because that is
 * what an author types; the document only ever stores the integer. */
const moneyToInputValue = (money: EmailEditorMoney): string =>
	money.amountInMinorUnits === 0
		? ""
		: (money.amountInMinorUnits / MINOR_UNITS_PER_UNIT).toString();

const inputValueToMinorUnits = (value: string): number => {
	const parsed = Number.parseFloat(value.replace(",", "."));
	return Number.isFinite(parsed)
		? Math.round(parsed * MINOR_UNITS_PER_UNIT)
		: 0;
};

/**
 * How a price reads on the canvas. The sent email formats it per recipient
 * (`renderMarketingEmailDocument`); the canvas shows the default locale, so an
 * author never sees an amount their reader will not get.
 */
export const formatPreviewPrice = (money: EmailEditorMoney): string =>
	new Intl.NumberFormat(EMAIL_PREVIEW_LOCALE, {
		style: "currency",
		currency: money.currency,
	}).format(money.amountInMinorUnits / MINOR_UNITS_PER_UNIT);

/**
 * The one price control. The document stores integer minor units and a
 * currency (never a formatted string), so one campaign can be sent in several
 * locales and formatted per recipient at render time.
 */
export function MoneyOption({
	label,
	value,
	onChange,
	description,
}: {
	label: string;
	value: EmailEditorMoney;
	onChange: (money: EmailEditorMoney) => void;
	description?: string;
}) {
	const id = useId();
	return (
		<BlockOptionRow label={label} htmlFor={id} description={description}>
			<MoneyInput
				id={id}
				value={moneyToInputValue(value)}
				onValueChange={(next) =>
					onChange({
						...value,
						amountInMinorUnits: inputValueToMinorUnits(next),
					})
				}
				currency={value.currency}
				currencyLabel="Devise"
			/>
		</BlockOptionRow>
	);
}
