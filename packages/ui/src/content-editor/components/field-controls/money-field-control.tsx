import type { FieldControlProps } from "#/content-editor/components/field-controls/field-control-props.ts";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
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
	return (
		<MoneyInput
			id={id}
			value={moneyToInputValue(value)}
			onValueChange={(next) =>
				onChange({ ...value, amountInMinorUnits: inputValueToMinorUnits(next) })
			}
			currency={value.currency}
			currencies={field.currencies}
			onCurrencyChange={(currency) => onChange({ ...value, currency })}
			currencyLabel={chrome.currency}
		/>
	);
}
