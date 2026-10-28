import { toNumber } from "#/core/scales/continuous.ts";
import { categoryKey } from "#/core/scales/discrete.ts";
import type { ChartColorScale, ChartValue } from "#/core/types.ts";

/**
 * Colours stay CSS strings all the way to the renderer (`var(--chart-2)`,
 * `color-mix(…)`): SVG resolves them itself, and the Canvas renderer resolves
 * them against the page, so a theme switch needs no recompute.
 */

/** One palette colour per category, cycling when there are more categories than colours. */
export function ordinalColorScale(
	domain: ReadonlyArray<ChartValue>,
	palette: ReadonlyArray<string>,
): ChartColorScale {
	const indexByKey = new Map<string, number>();
	for (const value of domain) {
		const key = categoryKey(value);
		if (!indexByKey.has(key)) {
			indexByKey.set(key, indexByKey.size);
		}
	}
	return {
		kind: "ordinal",
		domain,
		map: (value) =>
			palette[(indexByKey.get(categoryKey(value)) ?? 0) % palette.length],
	};
}

const PERCENT_PRECISION = 10;

/** A ramp between two colours, mixed by the browser in OKLab so the steps look even. */
export function sequentialColorScale(
	domain: readonly [number, number],
	[from, to]: readonly [string, string],
): ChartColorScale {
	const [low, high] = domain;
	const span = high - low;
	return {
		kind: "sequential",
		domain,
		map: (value) => {
			const share = span === 0 ? 1 : (toNumber(value) - low) / span;
			const percent =
				Math.round(Math.min(1, Math.max(0, share)) * 100 * PERCENT_PRECISION) /
				PERCENT_PRECISION;
			return `color-mix(in oklab, ${to} ${percent}%, ${from})`;
		},
	};
}
