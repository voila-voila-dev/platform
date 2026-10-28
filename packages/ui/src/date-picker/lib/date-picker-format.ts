import type { DateRange } from "react-day-picker";

/** Long localized date for the trigger label (e.g. "June 12, 2026" / "12 juin 2026"). */
export const DEFAULT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
	dateStyle: "long",
};

/** Local `yyyy-MM-dd` for the hidden form input — the shape a `<input type=date>` wants. */
export function toIsoDay(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

export function formatDateLabel(
	value: Date | null | undefined,
	locale: string | undefined,
	formatOptions: Intl.DateTimeFormatOptions,
	placeholder: string,
): string {
	if (!value) {
		return placeholder;
	}
	return new Intl.DateTimeFormat(locale, formatOptions).format(value);
}

// A same-day range (also the intermediate state after the first click)
// collapses to a single date instead of "June 9 – June 9".
export function formatDateRangeLabel(
	value: DateRange | null | undefined,
	locale: string | undefined,
	formatOptions: Intl.DateTimeFormatOptions,
	placeholder: string,
): string {
	if (!value?.from) {
		return placeholder;
	}
	const dateFormat = new Intl.DateTimeFormat(locale, formatOptions);
	if (!value.to || value.to.getTime() === value.from.getTime()) {
		return dateFormat.format(value.from);
	}
	return `${dateFormat.format(value.from)} – ${dateFormat.format(value.to)}`;
}
