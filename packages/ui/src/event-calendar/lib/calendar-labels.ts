/**
 * Every visible date label goes through the native `Intl` formatters, so the
 * calendar carries no locale data of its own: pass a BCP-47 `locale` to follow
 * a specific one, omit it to follow the runtime's.
 */

import {
	type WeekStart,
	weekDates,
} from "#/event-calendar/lib/calendar-dates.ts";
import type { CalendarViewMode } from "#/event-calendar/lib/calendar-event.ts";
import { formatMinutesLabel, minutesOfDay } from "#/lib/time-math.ts";

/** Short weekday name for a date, e.g. "Mon". */
export function weekdayLabel(
	date: Date,
	locale: string | undefined,
	weekday: "short" | "long" = "short",
): string {
	return new Intl.DateTimeFormat(locale, { weekday }).format(date);
}

/** Full day name for an accessible label, e.g. "June 10, 2026". */
export function dayLabel(date: Date, locale: string | undefined): string {
	return new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

/** Time of day, e.g. "10:00 AM" or "10:00" depending on the locale. */
export function timeLabel(date: Date, locale: string | undefined): string {
	return formatMinutesLabel(minutesOfDay(date), locale);
}

/** The hour-gutter label of the time grid, e.g. "9 AM" or "09". */
export function hourLabel(hour: number, locale: string | undefined): string {
	return formatMinutesLabel(hour * 60, locale, { hour: "numeric" });
}

/** The toolbar title for a view and its focused date. */
export function viewLabel(
	view: CalendarViewMode,
	date: Date,
	weekStartsOn: WeekStart,
	locale?: string,
): string {
	if (view === "day") {
		return new Intl.DateTimeFormat(locale, {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	}
	const monthFormat = new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "long",
	});
	if (view === "week") {
		const days = weekDates(date, weekStartsOn);
		const first = days[0];
		const last = days[6];
		if (!first || !last) return "";
		// `formatRange` collapses to a single "June 2026" when both ends share the
		// month, and reads as "July – August 2026" when they don't.
		return monthFormat.formatRange(first, last);
	}
	return monthFormat.format(date);
}
