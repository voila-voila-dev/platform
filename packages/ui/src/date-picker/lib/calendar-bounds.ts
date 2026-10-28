import type { Matcher } from "react-day-picker";
import type { CalendarPassthrough } from "#/date-picker/lib/date-picker-props.ts";

/**
 * How far the year dropdown reaches when `min`/`max` leave it open-ended.
 * react-day-picker's own fallback stops at the end of the current year, which
 * would hide every future date behind a dead dropdown.
 */
const YEARS_BACK = 100;
const YEARS_FORWARD = 10;

function boundsMatchers(min: Date | undefined, max: Date | undefined) {
	const matchers: Matcher[] = [];
	if (min) matchers.push({ before: min });
	if (max) matchers.push({ after: max });
	return matchers;
}

/**
 * The calendar props for a bounded, year-navigable calendar: month and year
 * dropdowns (scrolling a birth date month by month is not navigation), a
 * navigation range wide enough to reach it, and `min`/`max` turned into
 * disabled days. Explicit `calendarProps` win, except for `disabled`, which is
 * merged so a caller's own matchers never drop the bounds.
 */
export function boundedCalendarProps(
	calendarProps: CalendarPassthrough | undefined,
	min: Date | undefined,
	max: Date | undefined,
	today: Date,
): CalendarPassthrough {
	const provided = calendarProps?.disabled;
	const matchers = boundsMatchers(min, max);
	const disabled =
		provided === true
			? true
			: [
					...matchers,
					...(provided === undefined || provided === false
						? []
						: Array.isArray(provided)
							? provided
							: [provided]),
				];

	return {
		captionLayout: "dropdown",
		startMonth: min ?? new Date(today.getFullYear() - YEARS_BACK, 0, 1),
		endMonth: max ?? new Date(today.getFullYear() + YEARS_FORWARD, 11, 31),
		...calendarProps,
		disabled:
			Array.isArray(disabled) && disabled.length === 0 ? undefined : disabled,
	};
}
