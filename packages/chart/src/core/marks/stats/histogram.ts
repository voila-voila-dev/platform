import { isPlaceable, numericValue, readChannel } from "#/core/channel.ts";
import { rectY } from "#/core/marks/rect.ts";
import type { ChartMarkOptions } from "#/core/marks/shared.ts";
import { tickStep } from "#/core/ticks.ts";
import type { ChartAccessor, ChartMark, ChartValue } from "#/core/types.ts";

export interface HistogramOptions<TDatum> extends ChartMarkOptions<TDatum> {
	readonly x: ChartAccessor<TDatum, ChartValue>;
	/** About how many bins: the edges land on round numbers, so the count is approximate. */
	readonly bins?: number;
	readonly fill?: string;
	/** Each bin's share of the total instead of its count. */
	readonly normalize?: boolean;
}

export interface Bin {
	readonly x1: number;
	readonly x2: number;
	readonly count: number;
	readonly series?: ChartValue;
}

/** Round-edged bins over the values' extent, every value in exactly one. */
export function binValues(
	values: ReadonlyArray<number>,
	target: number,
): ReadonlyArray<{ x1: number; x2: number }> {
	const finite = values.filter(Number.isFinite);
	if (finite.length === 0) {
		return [];
	}
	const low = Math.min(...finite);
	const high = Math.max(...finite);
	const step = tickStep(low, high, target) || 1;
	const first = Math.floor(low / step) * step;
	const count = Math.max(
		1,
		Math.ceil((high - first) / step + (high === first ? 1 : 0)),
	);
	return Array.from({ length: count }, (_unused, index) => ({
		x1: first + index * step,
		x2: first + (index + 1) * step,
	}));
}

const DEFAULT_BINS = 20;

/**
 * Counts per bin, as touching rectangles over a continuous x. With a color
 * channel the series stack inside each bin.
 */
export function histogram<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: HistogramOptions<TDatum>,
): ChartMark {
	const xs = readChannel(data, options.x).map(numericValue);
	const colors = readChannel(data, options.color);
	const edges = binValues(
		xs.filter((value): value is number => value !== undefined),
		options.bins ?? DEFAULT_BINS,
	);
	const seriesValues =
		options.color === undefined
			? [undefined]
			: [
					...new Map(
						colors.filter(isPlaceable).map((value) => [String(value), value]),
					).values(),
				];
	const total = xs.filter((value) => value !== undefined).length || 1;
	const bins: Bin[] = [];
	for (const series of seriesValues) {
		for (const [binIndex, edge] of edges.entries()) {
			const last = binIndex === edges.length - 1;
			let count = 0;
			for (const [index, x] of xs.entries()) {
				const inSeries =
					series === undefined || String(colors[index]) === String(series);
				if (
					inSeries &&
					x !== undefined &&
					x >= edge.x1 &&
					(x < edge.x2 || (last && x <= edge.x2))
				) {
					count += 1;
				}
			}
			bins.push({
				...edge,
				count: options.normalize ? count / total : count,
				series,
			});
		}
	}
	return rectY(bins, {
		id: options.id,
		label: options.label,
		// Bins are not the caller's data: only a plain on/off carries over.
		tip: typeof options.tip === "function" ? undefined : options.tip,
		opacity: options.opacity,
		fill: options.fill,
		x1: (bin) => bin.x1,
		x2: (bin) => bin.x2,
		y: (bin) => bin.count,
		...(options.color === undefined
			? {}
			: { color: (bin: Bin) => bin.series as ChartValue }),
	});
}
