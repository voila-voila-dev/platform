import { useId } from "react";
import { DateBoundField } from "#/filter/components/fields/date-bound-field.tsx";
import { FilterFieldFrame } from "#/filter/components/fields/filter-field-frame.tsx";
import { FilterRangeRow } from "#/filter/components/fields/filter-range-row.tsx";
import type {
	DateRangeFilterDefinition,
	DateRangeFilterValue,
	FilterLabels,
} from "#/filter/types.ts";

interface Props {
	definition: DateRangeFilterDefinition;
	value: DateRangeFilterValue | undefined;
	onValueChange: (value: DateRangeFilterValue) => void;
	labels: FilterLabels;
	locale: string;
}

/** A start and an end date, either of which may be left open. */
export function DateRangeFilterField({
	definition,
	value,
	onValueChange,
	labels,
	locale,
}: Props) {
	const controlId = useId();
	const isEmpty = value?.from === undefined && value?.to === undefined;

	return (
		<FilterFieldFrame
			label={definition.label}
			description={definition.description}
			controlId={controlId}
			labels={labels}
			onClear={isEmpty ? undefined : () => onValueChange({ kind: "dateRange" })}
		>
			<FilterRangeRow>
				<DateBoundField
					id={controlId}
					value={value?.from}
					placeholder={labels.from}
					min={definition.min}
					max={value?.to ?? definition.max}
					locale={locale}
					onValueChange={(from) =>
						onValueChange({ kind: "dateRange", from, to: value?.to })
					}
				/>
				<DateBoundField
					value={value?.to}
					placeholder={labels.to}
					min={value?.from ?? definition.min}
					max={definition.max}
					locale={locale}
					onValueChange={(to) =>
						onValueChange({ kind: "dateRange", from: value?.from, to })
					}
				/>
			</FilterRangeRow>
		</FilterFieldFrame>
	);
}
