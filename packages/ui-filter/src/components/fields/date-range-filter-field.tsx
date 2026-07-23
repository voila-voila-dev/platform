import { DatePicker } from "@voila.dev/ui/components/date-picker";
import { NativeDatePicker } from "@voila.dev/ui/components/native-date-picker";
import { useIsMobile } from "@voila.dev/ui/hooks/use-mobile";
import { useId } from "react";
import {
	FilterFieldFrame,
	FilterRangeRow,
} from "#/components/fields/field-frame.tsx";
import type {
	DateRangeFilterDefinition,
	DateRangeFilterValue,
	FilterLabels,
} from "#/types.ts";

// Bounds are `YYYY-MM-DD` strings: that is what a native date input reads and
// writes, what a query string carries, and what survives a time zone unchanged.
const toIsoDay = (date: Date): string => {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
};

const fromIsoDay = (isoDate: string | undefined): Date | null => {
	if (isoDate === undefined) return null;
	const parsed = new Date(`${isoDate}T00:00:00`);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * One bound, on the surface that suits the device: the calendar popover on
 * desktop, the OS date picker under the mobile breakpoint.
 */
function DateBoundField({
	id,
	value,
	onValueChange,
	placeholder,
	min,
	max,
	locale,
}: {
	readonly id?: string;
	readonly value: string | undefined;
	readonly onValueChange: (isoDate: string | undefined) => void;
	readonly placeholder: string;
	readonly min?: string;
	readonly max?: string;
	readonly locale: string;
}) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<NativeDatePicker
				id={id}
				wrapperClassName="w-full"
				aria-label={placeholder}
				value={value ?? ""}
				min={min}
				max={max}
				onChange={(event) =>
					onValueChange(
						event.target.value === "" ? undefined : event.target.value,
					)
				}
			/>
		);
	}

	return (
		<DatePicker
			id={id}
			className="w-full"
			locale={locale}
			placeholder={placeholder}
			aria-label={placeholder}
			value={fromIsoDay(value)}
			onValueChange={(date) =>
				onValueChange(date === null ? undefined : toIsoDay(date))
			}
		/>
	);
}

/** A start and an end date, either of which may be left open. */
export function DateRangeFilterField({
	definition,
	value,
	onValueChange,
	labels,
	locale,
}: {
	readonly definition: DateRangeFilterDefinition;
	readonly value: DateRangeFilterValue | undefined;
	readonly onValueChange: (value: DateRangeFilterValue) => void;
	readonly labels: FilterLabels;
	readonly locale: string;
}) {
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
