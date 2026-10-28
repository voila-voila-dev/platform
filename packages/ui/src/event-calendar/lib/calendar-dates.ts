/**
 * Local-time date arithmetic for the event calendar. Every helper rebuilds a
 * date from local year/month/day parts, so an event sits on the day the viewer
 * reads on their own clock — never a UTC parse, which slips a day west of
 * Greenwich.
 */

/** First day of the week: 0 = Sunday, 1 = Monday. */
export type WeekStart = 0 | 1;

export const MS_PER_DAY = 86_400_000;

/** Local midnight of `date`'s calendar day. */
export function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** `date` shifted by whole days, at local midnight. */
export function addDays(date: Date, days: number): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** The first of the month `months` away from `date`. */
export function addMonths(date: Date, months: number): Date {
	return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

/** The start of the week containing `date`, honoring `weekStartsOn`. */
export function startOfWeek(date: Date, weekStartsOn: WeekStart): Date {
	const lead = (date.getDay() - weekStartsOn + 7) % 7;
	return addDays(startOfDay(date), -lead);
}

/** The seven dates of the week containing `date`. */
export function weekDates(date: Date, weekStartsOn: WeekStart): Date[] {
	const start = startOfWeek(date, weekStartsOn);
	return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

/** Whole weeks spanning `date`'s month, leading and trailing days included. */
export function monthMatrix(date: Date, weekStartsOn: WeekStart): Date[] {
	const year = date.getFullYear();
	const month = date.getMonth();
	const lead = (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7;
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const count = Math.ceil((lead + daysInMonth) / 7) * 7;
	return Array.from(
		{ length: count },
		(_, index) => new Date(year, month, 1 - lead + index),
	);
}
