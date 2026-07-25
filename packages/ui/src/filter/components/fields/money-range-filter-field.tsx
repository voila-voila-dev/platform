import { useId } from "react";
import { MoneyInput } from "#/components/money-input.tsx";
import {
	FilterFieldFrame,
	FilterRangeRow,
} from "#/filter/components/fields/field-frame.tsx";
import type {
	FilterLabels,
	MoneyRangeFilterDefinition,
	MoneyRangeFilterValue,
} from "#/filter/types.ts";

// Values travel as minor units (cents) — the platform's money representation —
// while the field edits a major-unit string, so the rounding happens once, here.
const toAmountInput = (minorUnits: number | undefined): string =>
	minorUnits === undefined ? "" : String(minorUnits / 100);

const toMinorUnits = (raw: string): number | undefined =>
	raw.trim() === "" || Number.isNaN(Number(raw))
		? undefined
		: Math.round(Number(raw) * 100);

/** A price floor and ceiling, either of which may be left open. */
export function MoneyRangeFilterField({
	definition,
	value,
	onValueChange,
	labels,
}: {
	readonly definition: MoneyRangeFilterDefinition;
	readonly value: MoneyRangeFilterValue | undefined;
	readonly onValueChange: (value: MoneyRangeFilterValue) => void;
	readonly labels: FilterLabels;
}) {
	const controlId = useId();
	const isEmpty = value?.min === undefined && value?.max === undefined;

	return (
		<FilterFieldFrame
			label={definition.label}
			description={definition.description}
			controlId={controlId}
			labels={labels}
			onClear={
				isEmpty ? undefined : () => onValueChange({ kind: "moneyRange" })
			}
		>
			<FilterRangeRow>
				<MoneyInput
					id={controlId}
					value={toAmountInput(value?.min)}
					placeholder={labels.min}
					currency={definition.currency}
					currencyLabel={definition.currency}
					onValueChange={(next) =>
						onValueChange({
							kind: "moneyRange",
							min: toMinorUnits(next),
							max: value?.max,
						})
					}
				/>
				<MoneyInput
					value={toAmountInput(value?.max)}
					placeholder={labels.max}
					currency={definition.currency}
					currencyLabel={definition.currency}
					onValueChange={(next) =>
						onValueChange({
							kind: "moneyRange",
							min: value?.min,
							max: toMinorUnits(next),
						})
					}
				/>
			</FilterRangeRow>
		</FilterFieldFrame>
	);
}
