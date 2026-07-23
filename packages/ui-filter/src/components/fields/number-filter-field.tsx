import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@voila.dev/ui/components/input-group";
import { useId } from "react";
import {
	FilterFieldFrame,
	FilterRangeRow,
} from "#/components/fields/field-frame.tsx";
import type {
	FilterLabels,
	NumberFilterDefinition,
	NumberFilterValue,
	NumberRangeFilterDefinition,
	NumberRangeFilterValue,
} from "#/types.ts";

/** `""` is a bound the reader cleared, not a zero — keep the two apart. */
const parseBound = (raw: string): number | undefined =>
	raw.trim() === "" || Number.isNaN(Number(raw)) ? undefined : Number(raw);

const toInputValue = (bound: number | undefined): string =>
	bound === undefined ? "" : String(bound);

function NumberField({
	id,
	value,
	onChange,
	unit,
	placeholder,
	min,
	max,
	step,
}: {
	readonly id?: string;
	readonly value: string;
	readonly onChange: (raw: string) => void;
	readonly unit?: string;
	readonly placeholder?: string;
	readonly min?: number;
	readonly max?: number;
	readonly step?: number;
}) {
	return (
		<InputGroup>
			<InputGroupInput
				id={id}
				type="number"
				inputMode="decimal"
				value={value}
				placeholder={placeholder}
				min={min}
				max={max}
				step={step}
				onChange={(event) => onChange(event.target.value)}
			/>
			{unit !== undefined && (
				<InputGroupAddon align="inline-end">{unit}</InputGroupAddon>
			)}
		</InputGroup>
	);
}

/** A single numeric value. */
export function NumberFilterField({
	definition,
	value,
	onValueChange,
	labels,
}: {
	readonly definition: NumberFilterDefinition;
	readonly value: NumberFilterValue | undefined;
	readonly onValueChange: (value: NumberFilterValue) => void;
	readonly labels: FilterLabels;
}) {
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

/** A lower and an upper bound, either of which may be left open. */
export function NumberRangeFilterField({
	definition,
	value,
	onValueChange,
	labels,
}: {
	readonly definition: NumberRangeFilterDefinition;
	readonly value: NumberRangeFilterValue | undefined;
	readonly onValueChange: (value: NumberRangeFilterValue) => void;
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
