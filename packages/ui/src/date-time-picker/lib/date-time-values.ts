import { formatMinutesLabel } from "#/lib/time-math.ts";

// One datetime field, two surfaces — mirroring `ResponsiveSelect`/`ResponsiveDialog`:
// the Base UI popover `DateTimePicker` (calendar + time list) on desktop and the
// OS-native `<input type="datetime-local">` under the `useIsMobile` breakpoint
// (768px), where the native picker is the better touch experience. All three speak
// a single `Date | null` value model so callers never juggle datetime strings.

/** Default time (09:00) applied when a day is picked before any time exists. */
export const DEFAULT_MINUTES = 9 * 60;

/** Long localized date + time for the trigger label (e.g. "Jun 20, 2026, 2:30 PM"). */
export const DEFAULT_DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
	dateStyle: "medium",
	timeStyle: "short",
};

const pad = (input: number): string => String(input).padStart(2, "0");

/** Local `yyyy-MM-ddTHH:mm` — the shape an `<input type="datetime-local">` wants. */
export function toLocalInputValue(date: Date): string {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
		date.getDate(),
	)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Parse the native input's local datetime string back to a `Date` (null when empty). */
export function parseLocalInputValue(value: string): Date | null {
	if (!value) return null;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

/** Local `yyyy-MM-ddTHH:mm` at midnight of the given day. */
export function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Localized time label for a minute-of-day, matching `TimePicker`. */
export function timeLabel(
	totalMinutes: number,
	locale: string | undefined,
): string {
	return formatMinutesLabel(totalMinutes, locale);
}
