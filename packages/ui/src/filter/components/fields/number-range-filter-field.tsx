import { useId } from "react";
import { FilterFieldFrame } from "#/filter/components/fields/filter-field-frame.tsx";
import { FilterRangeRow } from "#/filter/components/fields/filter-range-row.tsx";
import { NumberField } from "#/filter/components/fields/number-field.tsx";
import { parseBound } from "#/filter/components/fields/number-filter-field.tsx";
import type {
	FilterLabels,
	NumberRangeFilterDefinition,
	NumberRangeFilterValue,
} from "#/filter/types.ts";

const toInputValue = (bound: number | undefined): string =>
	bound === undefined ? "" : String(bound);

interface Props {
	definition: NumberRangeFilterDefinition;
	value: NumberRangeFilterValue | undefined;
	onValueChange: (value: NumberRangeFilterValue) => void;
	labels: FilterLabels;
}

/** A lower and an upper bound, either of which may be left open. */
export function NumberRangeFilterField({
	definition,
	value,
	onValueChange,
	labels,
}: Props) {
	const controlId = useId();
	const isEmpty = value?.min === undefined && value?.max === undefined;

	return (
		<FilterFieldFrame
			label={definition.label}
			description={definition.description}
			controlId={controlId}
			labels={labels}
			onClear={
				isEmpty ? undefined : () => onValueChange({ kind: "numberRange" })
			}
		>
			<FilterRangeRow>
				<NumberField
					id={controlId}
					value={toInputValue(value?.min)}
					placeholder={labels.min}
					unit={definition.unit}
					min={definition.min}
					max={definition.max}
					step={definition.step}
					onChange={(next) =>
						onValueChange({
							kind: "numberRange",
							min: parseBound(next),
							max: value?.max,
						})
					}
				/>
				<NumberField
					value={toInputValue(value?.max)}
					placeholder={labels.max}
					unit={definition.unit}
					min={definition.min}
					max={definition.max}
					step={definition.step}
					onChange={(next) =>
						onValueChange({
							kind: "numberRange",
							min: value?.min,
							max: parseBound(next),
						})
					}
				/>
			</FilterRangeRow>
		</FilterFieldFrame>
	);
}
