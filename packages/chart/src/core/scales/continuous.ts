import { formatCompactNumber, formatTickValue } from "#/core/format.ts";
import { niceTicks } from "#/core/ticks.ts";
import type { ChartPositionScale, ChartValue } from "#/core/types.ts";

export interface ContinuousScaleOptions {
	readonly domain: readonly [number, number];
	readonly range: readonly [number, number];
	readonly locale: string;
	/** How many ticks the axis has room for. */
	readonly tickCount: number;
}

export function toNumber(value: ChartValue): number {
	if (value instanceof Date) {
		return value.getTime();
	}
	return typeof value === "number" ? value : Number(value);
}

function interpolator(
	[domainStart, domainEnd]: readonly [number, number],
	[rangeStart, rangeEnd]: readonly [number, number],
) {
	const domainSpan = domainEnd - domainStart;
	const rangeSpan = rangeEnd - rangeStart;
	return {
		// A zero-width domain collapses to the middle of the range: a flat series
		// draws a centred line instead of dividing by zero.
		forward: (value: number) =>
			domainSpan === 0
				? rangeStart + rangeSpan / 2
				: rangeStart + ((value - domainStart) / domainSpan) * rangeSpan,
		backward: (pixel: number) =>
			rangeSpan === 0
				? domainStart
				: domainStart + ((pixel - rangeStart) / rangeSpan) * domainSpan,
	};
}

/** Numbers in, pixels out, linearly. */
export function linearScale(
	options: ContinuousScaleOptions,
): ChartPositionScale {
	const { domain, range, locale, tickCount } = options;
	const { forward, backward } = interpolator(domain, range);
	const map = (value: ChartValue) => forward(toNumber(value));
	return {
		kind: "linear",
		domain,
		range,
		bandwidth: 0,
		map,
		center: map,
		invert: backward,
		ticks: (count = tickCount) =>
			niceTicks(
				Math.min(domain[0], domain[1]),
				Math.max(domain[0], domain[1]),
				count,
			),
		format: (value) => formatTickValue(toNumber(value), locale),
	};
}

/**
 * Orders of magnitude, for data that spans several of them. Values at or
 * below zero have no logarithm: they are clamped onto the bottom of the scale
 * rather than drawn at minus infinity.
 */
export function logScale(options: ContinuousScaleOptions): ChartPositionScale {
	const { range, locale, tickCount } = options;
	const low = Math.max(Number.MIN_VALUE, Math.min(...options.domain));
	const high = Math.max(low, ...options.domain);
	const logDomain: readonly [number, number] = [
		Math.log10(low),
		Math.log10(high),
	];
	const { forward, backward } = interpolator(logDomain, range);
	const map = (value: ChartValue) =>
		forward(Math.log10(Math.max(low, toNumber(value))));

	function ticks(count = tickCount): ReadonlyArray<number> {
		const first = Math.floor(logDomain[0]);
		const last = Math.ceil(logDomain[1]);
		const decades = last - first;
		// Few decades leave room for 2 and 5 between the powers of ten.
		const multiples = decades * 3 <= count ? [1, 2, 5] : [1];
		const values: number[] = [];
		for (let power = first; power <= last; power += 1) {
			for (const multiple of multiples) {
				const value = multiple * 10 ** power;
				if (value >= low && value <= high) {
					values.push(value);
				}
			}
		}
		return values;
	}

	return {
		kind: "log",
		domain: [low, high],
		range,
		bandwidth: 0,
		map,
		center: map,
		invert: (pixel) => 10 ** backward(pixel),
		ticks,
		format: (value) => formatCompactNumber(toNumber(value), locale),
	};
}
