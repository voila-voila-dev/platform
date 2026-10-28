import * as React from "react";
import {
	startOfDay,
	toLocalInputValue,
} from "#/date-time-picker/lib/date-time-values.ts";

/** A start/end pair, each `null` until picked, as {@link DateTimeRangeInput} holds it. */
export type DateTimeRange = {
	start: Date | null;
	end: Date | null;
};

/**
 * Controlled-or-uncontrolled `{ start, end }` state, shared by the two range
 * inputs: `range` is the current value and `commit` writes it (updating the
 * internal state only while uncontrolled) before notifying the caller.
 */
export function useDateTimeRangeState({
	value,
	defaultValue,
	onValueChange,
}: {
	value?: DateTimeRange;
	defaultValue?: DateTimeRange;
	onValueChange?: (range: DateTimeRange) => void;
}): { range: DateTimeRange; commit: (next: DateTimeRange) => void } {
	const isControlled = value !== undefined;
	const [uncontrolled, setUncontrolled] = React.useState<DateTimeRange>(
		defaultValue ?? { start: null, end: null },
	);

	return {
		range: isControlled ? value : uncontrolled,
		commit: (next: DateTimeRange) => {
			if (!isControlled) setUncontrolled(next);
			onValueChange?.(next);
		},
	};
}

export function resolveEndFieldId(
	startId: string | undefined,
	endId: string | undefined,
): string | undefined {
	if (endId !== undefined) {
		return endId;
	}
	return startId ? `${startId}-end` : undefined;
}

/**
 * Keep the end from landing before the start: bound the native input and disable
 * earlier days in the desktop calendar (the start-change seeding handles same-day
 * times).
 */
export function endFieldBounds(start: Date | null): {
	min: string | undefined;
	calendarProps: { disabled: { before: Date } } | undefined;
} {
	if (start === null) {
		return { min: undefined, calendarProps: undefined };
	}
	return {
		min: toLocalInputValue(start),
		calendarProps: { disabled: { before: startOfDay(start) } },
	};
}
