import { readNumber } from "#/chart/core/chart-model.ts";
import type {
	ChartDatum,
	ChartDiscreteScale,
	ChartLinearScale,
	ChartOrientation,
	ChartPoint,
} from "#/chart/core/types.ts";

/**
 * Point geometry shared by the line, area and scatter marks: one place that
 * knows a category runs along x when the chart is upright and along y when it
 * is on its side.
 */

export interface SeriesPointsOptions {
	readonly data: ReadonlyArray<ChartDatum>;
	readonly categories: ReadonlyArray<string>;
	readonly categoryScale: ChartDiscreteScale;
	readonly valueScale: ChartLinearScale;
	readonly orientation: ChartOrientation;
	readonly key: string;
	/**
	 * Value each point sits on top of, per datum — the running total under a
	 * stacked series. Defaults to zero, i.e. straight off the baseline.
	 */
	readonly base?: ReadonlyArray<number>;
}

export function seriesPoints(
	options: SeriesPointsOptions,
): ReadonlyArray<ChartPoint> {
	const {
		data,
		categories,
		categoryScale,
		valueScale,
		orientation,
		key,
		base,
	} = options;

	return data.map((datum, index) => {
		const along = categoryScale.center(categories[index] ?? String(index));
		const value = readNumber(datum, key) + (base?.[index] ?? 0);
		const across = valueScale.scale(value);
		return orientation === "vertical"
			? { x: along, y: across }
			: { x: across, y: along };
	});
}

/**
 * Running totals under each series of a stack, in draw order. `stackTops[key]`
 * is what the next series up should sit on.
 */
export function stackBases(
	data: ReadonlyArray<ChartDatum>,
	keys: ReadonlyArray<string>,
): ReadonlyMap<string, ReadonlyArray<number>> {
	const bases = new Map<string, ReadonlyArray<number>>();
	const running = data.map(() => 0);
	for (const key of keys) {
		bases.set(key, [...running]);
		for (const [index, datum] of data.entries()) {
			running[index] += readNumber(datum, key);
		}
	}
	return bases;
}
