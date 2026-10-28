/**
 * First day of the week for a BCP-47 locale (react-day-picker's `weekStartsOn`,
 * 0 = Sunday), read from the native `Intl.Locale` week info: `en-US` → Sunday,
 * `fr-FR` → Monday. Returns undefined (react-day-picker's default) when the
 * runtime lacks the API or the locale is omitted.
 */
export function weekStartFromLocale(
	locale: string | undefined,
): 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined {
	if (!locale) return undefined;
	try {
		const intlLocale = new Intl.Locale(locale) as Intl.Locale & {
			getWeekInfo?: () => { firstDay: number };
			weekInfo?: { firstDay: number };
		};
		const info = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
		// Intl reports 1 = Monday … 7 = Sunday; map Sunday (7) to 0 for the picker.
		if (info) return (info.firstDay % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
	} catch {
		// Older runtimes lack Intl week info; fall back to the picker default.
	}
	return undefined;
}
