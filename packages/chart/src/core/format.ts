/**
 * Number formatting for axes, labels and tooltips. The whole app writes its
 * numbers in French, so that is the default here too — pass an explicit locale
 * when a chart lives on a page that does not.
 */

const DEFAULT_LOCALE = "fr-FR";
/** Above this magnitude an axis tick reads better as "12 k" than as "12 000". */
const COMPACT_THRESHOLD = 10_000;

const formatterCache = new Map<string, Intl.NumberFormat>();

function formatterFor(
	locale: string,
	options: Intl.NumberFormatOptions,
): Intl.NumberFormat {
	const cacheKey = `${locale}:${JSON.stringify(options)}`;
	const cached = formatterCache.get(cacheKey);
	if (cached !== undefined) {
		return cached;
	}
	const created = new Intl.NumberFormat(locale, options);
	formatterCache.set(cacheKey, created);
	return created;
}

export interface FormatNumberOptions {
	readonly locale?: string;
	readonly maximumFractionDigits?: number;
	readonly minimumFractionDigits?: number;
}

export function formatNumber(
	value: number,
	options: FormatNumberOptions = {},
): string {
	const { locale = DEFAULT_LOCALE, ...digits } = options;
	return formatterFor(locale, digits).format(value);
}

/** "12 k", "3,4 M" — for axis ticks, where width is the scarce resource. */
export function formatCompactNumber(
	value: number,
	locale: string = DEFAULT_LOCALE,
): string {
	return formatterFor(locale, {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value);
}

export function formatPercentage(
	fraction: number,
	locale: string = DEFAULT_LOCALE,
): string {
	return formatterFor(locale, {
		style: "percent",
		maximumFractionDigits: 1,
	}).format(fraction);
}

/**
 * What a value axis uses when the caller has no opinion: plain digits until the
 * numbers get long, compact notation after that, and at most one decimal so a
 * tick step of 0.5 still reads correctly.
 */
export function formatTickValue(
	value: number,
	locale: string = DEFAULT_LOCALE,
): string {
	if (Math.abs(value) >= COMPACT_THRESHOLD) {
		return formatCompactNumber(value, locale);
	}
	return formatNumber(value, { locale, maximumFractionDigits: 2 });
}

/** Renders an unknown datum field as a label without throwing on `null`. */
export function formatLabel(value: unknown): string {
	if (value === null || value === undefined) {
		return "";
	}
	if (typeof value === "number") {
		return formatTickValue(value);
	}
	return String(value);
}

/**
 * A value as a tooltip, the live region or the data table says it: dates in
 * full, numbers grouped, strings as they are.
 */
export function formatValue(
	value: unknown,
	locale: string = DEFAULT_LOCALE,
): string {
	if (value instanceof Date) {
		return formatDate(value, locale);
	}
	if (typeof value === "number") {
		return formatNumber(value, { locale, maximumFractionDigits: 2 });
	}
	return formatLabel(value);
}

const formatters = new Map<string, Intl.DateTimeFormat>();

export function dateFormat(
	locale: string,
	options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
	const key = `${locale}:${JSON.stringify(options)}`;
	const cached = formatters.get(key);
	if (cached !== undefined) {
		return cached;
	}
	const created = new Intl.DateTimeFormat(locale, {
		...options,
		timeZone: "UTC",
	});
	formatters.set(key, created);
	return created;
}

const MS_PER_DAY = 86_400_000;

/** A date written in full, for a tooltip or a table cell: "3 mars 2026", with the time when there is one. */
export function formatDate(value: Date, locale: string): string {
	const time = value.getTime();
	const hasTime = time % MS_PER_DAY !== 0;
	return dateFormat(locale, {
		day: "numeric",
		month: "long",
		year: "numeric",
		...(hasTime ? { hour: "2-digit", minute: "2-digit" } : {}),
	}).format(value);
}

/**
 * How to write the dates of one channel in full, judged on all of them: a
 * series of month buckets reads "mars 2026", of years "2026", anything finer
 * the full date.
 */
export function dateValueFormatter(
	values: ReadonlyArray<unknown>,
	locale: string,
): ((value: Date) => string) | undefined {
	const dates = values.filter((value): value is Date => value instanceof Date);
	if (dates.length === 0) {
		return undefined;
	}
	const firstOfMonth = dates.every(
		(date) => date.getTime() % MS_PER_DAY === 0 && date.getUTCDate() === 1,
	);
	if (firstOfMonth && dates.every((date) => date.getUTCMonth() === 0)) {
		const year = dateFormat(locale, { year: "numeric" });
		return (value) => year.format(value);
	}
	if (firstOfMonth) {
		const month = dateFormat(locale, { month: "long", year: "numeric" });
		return (value) => month.format(value);
	}
	return undefined;
}
