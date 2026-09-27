/**
 * `2026-07-20` in the reader's words. The node stores the ISO day, not a
 * formatted string, because one campaign goes out in several locales. A
 * value that is not an ISO day is shown as typed, so a half-typed date on
 * the canvas never turns into "Invalid Date".
 */
export function formatContentDate(isoDay: string, locale: string): string {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDay)) {
		return isoDay;
	}
	const date = new Date(`${isoDay}T00:00:00Z`);
	return Number.isNaN(date.getTime())
		? isoDay
		: new Intl.DateTimeFormat(locale, {
				dateStyle: "long",
				timeZone: "UTC",
			}).format(date);
}
