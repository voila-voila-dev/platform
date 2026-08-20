/**
 * `<input type="date">` speaks `yyyy-MM-dd` in the browser's own time zone,
 * while the pickers speak `Date`. Both helpers stay in local time: going
 * through `toISOString()` would shift the day for anyone east or west of UTC.
 */

export function toIsoDay(date: Date | null | undefined): string {
	if (!date) return "";
	const year = String(date.getFullYear()).padStart(4, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function fromIsoDay(value: string): Date | null {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (!match) return null;
	const [, year, month, day] = match;
	const date = new Date(Number(year), Number(month) - 1, Number(day));
	// The native field can hand over an impossible day (e.g. 2026-02-31 while
	// the segments are half-edited); those roll over, so reject them.
	return date.getMonth() === Number(month) - 1 ? date : null;
}
