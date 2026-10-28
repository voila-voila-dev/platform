import * as React from "react";
import type { DateRange } from "react-day-picker";

/** The empty range, so the two field pairs agree on what "nothing picked" is. */
const EMPTY: DateRange = { from: undefined, to: undefined };

/**
 * Controlled-or-uncontrolled `{ from, to }` state, shared by the range field
 * pairs: `range` is the current value and `commit` writes it (updating the
 * internal state only while uncontrolled) before notifying the caller.
 *
 * The value type is react-day-picker's `DateRange`, the same one the popover
 * `DateRangePicker` reports, so the three range surfaces are interchangeable.
 */
export function useDateRangeState({
	value,
	defaultValue,
	onValueChange,
}: {
	value?: DateRange | null;
	defaultValue?: DateRange;
	onValueChange?: (range: DateRange) => void;
}): { range: DateRange; commit: (next: DateRange) => void } {
	const isControlled = value !== undefined;
	const [uncontrolled, setUncontrolled] = React.useState<DateRange>(
		defaultValue ?? EMPTY,
	);

	return {
		range: (isControlled ? (value ?? EMPTY) : uncontrolled) satisfies DateRange,
		commit: (next: DateRange) => {
			if (!isControlled) setUncontrolled(next);
			onValueChange?.(next);
		},
	};
}

export function resolveToFieldId(
	fromId: string | undefined,
	toId: string | undefined,
): string | undefined {
	if (toId !== undefined) {
		return toId;
	}
	return fromId ? `${fromId}-to` : undefined;
}
