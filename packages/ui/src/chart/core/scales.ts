import { niceTicks } from "#/chart/core/ticks.ts";
import type {
	ChartDiscreteScale,
	ChartInterval,
	ChartLinearScale,
} from "#/chart/core/types.ts";

/**
 * The three scales a cartesian chart needs, written out rather than pulled in.
 * Each one is a plain object of closures: no state, no mutation, safe to build
 * during render and cheap enough to build on every render.
 */

const DEFAULT_BAND_PADDING_INNER = 0.2;
const DEFAULT_BAND_PADDING_OUTER = 0.1;

function clamp(value: number, low: number, high: number): number {
	return Math.min(Math.max(value, low), high);
}

export interface LinearScaleOptions {
	readonly domain: ChartInterval;
	readonly range: ChartInterval;
}

/**
 * Maps a numeric domain onto a pixel range, linearly. A zero-width domain
 * collapses to the middle of the range, so a flat series draws a centred line
 * instead of dividing by zero.
 */
export function linearScale(options: LinearScaleOptions): ChartLinearScale {
	const [domainStart, domainEnd] = options.domain;
	const [rangeStart, rangeEnd] = options.range;
	const domainSpan = domainEnd - domainStart;
	const rangeSpan = rangeEnd - rangeStart;

	const scale = (value: number): number =>
		domainSpan === 0
			? rangeStart + rangeSpan / 2
			: rangeStart + ((value - domainStart) / domainSpan) * rangeSpan;

	const invert = (pixel: number): number =>
		rangeSpan === 0
			? domainStart
			: domainStart + ((pixel - rangeStart) / rangeSpan) * domainSpan;

	return {
		kind: "linear",
		domain: options.domain,
		range: options.range,
		bandwidth: 0,
		scale,
		invert,
		ticks: (count) =>
			niceTicks(
				Math.min(domainStart, domainEnd),
				Math.max(domainStart, domainEnd),
				count,
			),
	};
}

export interface BandScaleOptions {
	readonly domain: ReadonlyArray<string>;
	readonly range: ChartInterval;
	/** Share of a step left empty between two bands. 0 = touching bars. */
	readonly paddingInner?: number;
	/** Share of a step left empty before the first and after the last band. */
	readonly paddingOuter?: number;
}

/**
 * Maps categories onto equal slots of `bandwidth` pixels — the scale bars sit
 * on. Categories are looked up by value, so duplicate category labels collapse
 * onto the first slot (which is what a duplicated x value means anyway).
 */
export function bandScale(options: BandScaleOptions): ChartDiscreteScale {
	const {
		domain,
		range,
		paddingInner = DEFAULT_BAND_PADDING_INNER,
		paddingOuter = DEFAULT_BAND_PADDING_OUTER,
	} = options;
	const [rangeStart, rangeEnd] = range;
	const count = domain.length;
	const step =
		(rangeEnd - rangeStart) /
		Math.max(1, count - paddingInner + paddingOuter * 2);
	const bandwidth = step * (1 - paddingInner);
	const origin = rangeStart + step * paddingOuter;
	const indexByValue = new Map<string, number>();
	for (const [index, value] of domain.entries()) {
		if (!indexByValue.has(value)) {
			indexByValue.set(value, index);
		}
	}

	const scale = (value: string): number =>
		origin + step * (indexByValue.get(value) ?? 0);

	return {
		kind: "band",
		domain,
		range,
		bandwidth,
		step,
		scale,
		center: (value) => scale(value) + bandwidth / 2,
		invert: (pixel) =>
			count === 0
				? 0
				: clamp(Math.floor((pixel - origin) / step), 0, count - 1),
		ticks: () => domain,
	};
}

export interface PointScaleOptions {
	readonly domain: ReadonlyArray<string>;
	readonly range: ChartInterval;
	/** Share of a step left empty at each end. 0 pins the ends to the edges. */
	readonly padding?: number;
}

/**
 * Maps categories onto evenly spaced positions with no width — the scale lines
 * and areas sit on, where the first and last points touch the plot edges.
 */
export function pointScale(options: PointScaleOptions): ChartDiscreteScale {
	const { domain, range, padding = 0 } = options;
	const [rangeStart, rangeEnd] = range;
	const count = domain.length;
	const step = (rangeEnd - rangeStart) / Math.max(1, count - 1 + padding * 2);
	const origin = rangeStart + step * padding;
	const indexByValue = new Map<string, number>();
	for (const [index, value] of domain.entries()) {
		if (!indexByValue.has(value)) {
			indexByValue.set(value, index);
		}
	}

	const scale = (value: string): number =>
		count <= 1
			? rangeStart + (rangeEnd - rangeStart) / 2
			: origin + step * (indexByValue.get(value) ?? 0);

	return {
		kind: "point",
		domain,
		range,
		bandwidth: 0,
		step,
		scale,
		center: scale,
		invert: (pixel) =>
			count === 0
				? 0
				: clamp(Math.round((pixel - origin) / step), 0, count - 1),
		ticks: () => domain,
	};
}

/** Type guard so marks can branch on "is this axis continuous?". */
export function isLinearScale(
	scale: ChartLinearScale | ChartDiscreteScale,
): scale is ChartLinearScale {
	return scale.kind === "linear";
}
