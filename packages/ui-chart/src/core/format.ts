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
