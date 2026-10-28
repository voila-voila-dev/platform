import { dateFormat, formatDate } from "#/core/format.ts";
import type { ChartPositionScale, ChartValue } from "#/core/types.ts";

/**
 * Categories in, slots out. `band` gives each category a slot of `bandwidth`
 * pixels (what bars sit on), `point` a position with no width (what lines sit
 * on, first and last touching the plot edges).
 */

export interface DiscreteScaleOptions {
	readonly domain: ReadonlyArray<ChartValue>;
	readonly range: readonly [number, number];
	readonly locale: string;
	/** Share of a step left empty between two bands. 0 = touching bars. */
	readonly paddingInner?: number;
	/** Share of a step left empty before the first and after the last slot. */
	readonly paddingOuter?: number;
}

const DEFAULT_BAND_PADDING_INNER = 0.2;
const DEFAULT_BAND_PADDING_OUTER = 0.1;

/** A category's identity: two equal dates are one category. */
export function categoryKey(value: ChartValue): string {
	return value instanceof Date ? `${value.getTime()}` : String(value);
}

/** A category as a label. A year stays "2026", never "2 026". */
export function formatCategory(value: ChartValue, locale: string): string {
	return value instanceof Date ? formatDate(value, locale) : String(value);
}

/**
 * Labels for a row of date categories, as short as the dates allow: years
 * when every date is a New Year, months when every date is a first of the
 * month (with the year where it turns), days when every date is a midnight.
 */
function dateCategoryFormatter(
	domain: ReadonlyArray<ChartValue>,
	locale: string,
): ((value: ChartValue) => string) | undefined {
	const dates = domain.filter((value): value is Date => value instanceof Date);
	if (dates.length === 0 || dates.length !== domain.length) {
		return undefined;
	}
	const midnight = dates.every((date) => date.getTime() % 86_400_000 === 0);
	const firstOfMonth =
		midnight && dates.every((date) => date.getUTCDate() === 1);
	const newYear =
		firstOfMonth && dates.every((date) => date.getUTCMonth() === 0);
	if (newYear) {
		const year = dateFormat(locale, { year: "numeric" });
		return (value) => year.format(value as Date);
	}
	if (firstOfMonth) {
		const month = dateFormat(locale, { month: "short" });
		const monthYear = dateFormat(locale, { month: "short", year: "numeric" });
		const first = dates[0].getTime();
		return (value) => {
			const date = value as Date;
			return date.getUTCMonth() === 0 || date.getTime() === first
				? monthYear.format(date)
				: month.format(date);
		};
	}
	if (midnight) {
		const day = dateFormat(locale, { day: "numeric", month: "short" });
		return (value) => day.format(value as Date);
	}
	return undefined;
}

function clamp(value: number, low: number, high: number): number {
	return Math.min(Math.max(value, low), high);
}

function indexer(domain: ReadonlyArray<ChartValue>) {
	const indexByKey = new Map<string, number>();
	for (const [index, value] of domain.entries()) {
		const key = categoryKey(value);
		if (!indexByKey.has(key)) {
			indexByKey.set(key, index);
		}
	}
	return (value: ChartValue) => indexByKey.get(categoryKey(value)) ?? 0;
}

export function bandScale(options: DiscreteScaleOptions): ChartPositionScale {
	const {
		domain,
		range,
		locale,
		paddingInner = DEFAULT_BAND_PADDING_INNER,
		paddingOuter = DEFAULT_BAND_PADDING_OUTER,
	} = options;
	const [start, end] = range;
	const count = domain.length;
	const step =
		(end - start) / Math.max(1, count - paddingInner + paddingOuter * 2);
	const bandwidth = Math.abs(step * (1 - paddingInner));
	const origin = start + step * paddingOuter;
	const indexOf = indexer(domain);
	// A reversed range (a y band running top to bottom is not, but a flipped
	// one is) still opens each band towards larger pixels.
	const map = (value: ChartValue) =>
		origin + step * indexOf(value) - (step < 0 ? bandwidth : 0);

	return {
		kind: "band",
		domain,
		range,
		bandwidth,
		map,
		center: (value) => map(value) + bandwidth / 2,
		invert: (pixel) =>
			domain[
				count === 0
					? 0
					: clamp(Math.floor((pixel - origin) / step), 0, count - 1)
			],
		ticks: () => domain,
		format:
			dateCategoryFormatter(domain, locale) ??
			((value) => formatCategory(value, locale)),
	};
}

export function pointScale(options: DiscreteScaleOptions): ChartPositionScale {
	const { domain, range, locale, paddingOuter = 0 } = options;
	const [start, end] = range;
	const count = domain.length;
	const step = (end - start) / Math.max(1, count - 1 + paddingOuter * 2);
	const origin = start + step * paddingOuter;
	const indexOf = indexer(domain);
	const map = (value: ChartValue) =>
		count <= 1 ? start + (end - start) / 2 : origin + step * indexOf(value);

	return {
		kind: "point",
		domain,
		range,
		bandwidth: 0,
		map,
		center: map,
		invert: (pixel) =>
			domain[
				count === 0
					? 0
					: clamp(Math.round((pixel - origin) / step), 0, count - 1)
			],
		ticks: () => domain,
		format:
			dateCategoryFormatter(domain, locale) ??
			((value) => formatCategory(value, locale)),
	};
}
