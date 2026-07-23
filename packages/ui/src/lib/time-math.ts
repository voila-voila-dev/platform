/**
 * Minute-of-day arithmetic shared by the time pickers (`time-picker.tsx`,
 * `date-time-picker.tsx`), which both model a time as minutes since midnight.
 */

/** Time-of-day formatting: short localized time (e.g. "2:30 PM" / "14:30"). */
const DEFAULT_TIME_FORMAT: Intl.DateTimeFormatOptions = {
	hour: "numeric",
	minute: "2-digit",
};

/** Parse an "HH:mm" string to minutes since midnight (null when malformed). */
export function parseTimeToMinutes(
	time: string | null | undefined,
): number | null {
	if (!time) return null;
	const match = /^(\d{1,2}):(\d{2})$/.exec(time);
	if (!match) return null;
	const hours = Number(match[1]);
	const minutes = Number(match[2]);
	if (hours > 23 || minutes > 59) return null;
	return hours * 60 + minutes;
}

/** Serialize minutes since midnight back to a zero-padded "HH:mm" string. */
export function minutesToTimeValue(totalMinutes: number): string {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Minutes since midnight of a `Date`'s local time-of-day. */
export function minutesOfDay(date: Date): number {
	return date.getHours() * 60 + date.getMinutes();
}

/** A copy of `date` with the time-of-day set to `totalMinutes` (seconds/ms zeroed). */
export function withMinutes(date: Date, totalMinutes: number): Date {
	const next = new Date(date);
	next.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0);
	return next;
}

/**
 * Localized label for a minute-of-day via the native `Intl.DateTimeFormat`, so
 * AM/PM vs 24-hour follows the given BCP-47 locale (e.g. "2:30 PM" for `en-US`,
 * "14:30" for `fr-FR`). `locale` undefined falls back to the runtime default.
 */
export function formatMinutesLabel(
	totalMinutes: number,
	locale: string | undefined,
	options: Intl.DateTimeFormatOptions = DEFAULT_TIME_FORMAT,
): string {
	const date = new Date(
		2000,
		0,
		1,
		Math.floor(totalMinutes / 60),
		totalMinutes % 60,
	);
	return new Intl.DateTimeFormat(locale, options).format(date);
}
