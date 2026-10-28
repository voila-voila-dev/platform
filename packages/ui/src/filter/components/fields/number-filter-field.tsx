import { useId } from "react";
import { FilterFieldFrame } from "#/filter/components/fields/filter-field-frame.tsx";
import { NumberField } from "#/filter/components/fields/number-field.tsx";
import type {
	FilterLabels,
	NumberFilterDefinition,
	NumberFilterValue,
} from "#/filter/types.ts";

interface Props {
	definition: NumberFilterDefinition;
	value: NumberFilterValue | undefined;
	onValueChange: (value: NumberFilterValue) => void;
	labels: FilterLabels;
}

/** A single numeric value. */
export function NumberFilterField({
	definition,
	value,
	onValueChange,
	labels,
}: Props) {
	const controlId = useId();
	const raw = value === undefined ? "" : String(value.number);

	return (
		<FilterFieldFrame
			label={definition.label}
			description={definition.description}
			controlId={controlId}
			labels={labels}
			onClear={
				raw === ""
					? undefined
					: () => onValueChange({ kind: "number", number: Number.NaN })
			}
		>
			<NumberField
				id={controlId}
				value={raw}
				unit={definition.unit}
				min={definition.min}
				max={definition.max}
				step={definition.step}
				onChange={(next) =>
					onValueChange({
						kind: "number",
						number: parseBound(next) ?? Number.NaN,
					})
				}
			/>
		</FilterFieldFrame>
	);
}

/** `""` is a bound the reader cleared, not a zero — keep the two apart. */
export const parseBound = (raw: string): number | undefined =>
	raw.trim() === "" || Number.isNaN(Number(raw)) ? undefined : Number(raw);
