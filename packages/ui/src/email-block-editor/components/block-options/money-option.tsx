import { useId } from "react";
import { BlockOptionRow } from "#/email-block-editor/components/block-options/block-option-row.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorMoney } from "#/email-block-editor/document/types.ts";
import {
	inputValueToMinorUnits,
	moneyToInputValue,
} from "#/email-block-editor/lib/money.ts";
import { MoneyInput } from "#/money-input/components/money-input.tsx";

interface Props<Currency extends string> {
	label: string;
	value: EmailEditorMoney<Currency>;
	onChange: (money: EmailEditorMoney<Currency>) => void;
	description?: string;
}

/**
 * The one price control. The document stores integer minor units and a
 * currency (never a formatted string), so one campaign can be sent in several
 * locales and formatted per recipient at render time.
 */
export function MoneyOption<Currency extends string>({
	label,
	value,
	onChange,
	description,
}: Props<Currency>) {
	const id = useId();
	const { fields } = useEmailEditorLabels();
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
				currencyLabel={fields.currency}
			/>
		</BlockOptionRow>
	);
}
