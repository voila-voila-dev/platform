import type { FieldControlProps } from "#/content-editor/components/field-controls/field-control-props.ts";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentMoney } from "#/content-editor/features/field-definition.ts";
import {
	inputValueToMinorUnits,
	moneyToInputValue,
} from "#/content-editor/lib/money.ts";
import { MoneyInput } from "#/money-input/components/money-input.tsx";

export function MoneyFieldControl({
	id,
	field,
	value,
	onChange,
}: FieldControlProps<"money">) {
	const { chrome } = useContentEditorLabels();
	const money = value ?? {
		amountInMinorUnits: 0,
		currency: field.currencies?.[0] ?? "EUR",
	};
	const set = (next: ContentMoney) =>
		onChange(
			field.optional === true && next.amountInMinorUnits === 0 ? null : next,
		);
	return (
		<MoneyInput
			id={id}
			value={moneyToInputValue(money)}
			onValueChange={(next) =>
				set({ ...money, amountInMinorUnits: inputValueToMinorUnits(next) })
			}
			currency={money.currency}
			currencies={field.currencies}
			onCurrencyChange={(currency) => set({ ...money, currency })}
			currencyLabel={chrome.currency}
		/>
	);
}
