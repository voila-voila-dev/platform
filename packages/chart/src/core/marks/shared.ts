import {
	channelLabel,
	isPlaceable,
	numericValue,
	readChannel,
} from "#/core/channel.ts";
import { categoryKey } from "#/core/scales/discrete.ts";
import type {
	ChartAccessor,
	ChartChannel,
	ChartMarkContext,
	ChartPaint,
	ChartPositionScale,
	ChartValue,
} from "#/core/types.ts";

/** Options every mark takes. */
export interface ChartMarkOptions<TDatum> {
	/** Stable identity, so focus and legend state survive a data update. */
	readonly id?: string;
	/** The series' name when the mark has no color channel: legend, tooltip, table. */
	readonly label?: string;
	/** A field or function whose distinct values split the mark into coloured series. */
	readonly color?: ChartAccessor<TDatum, ChartValue>;
	/**
	 * `false` keeps the mark out of focus, tooltips and the data table; a
	 * function decides per datum (the point where a recorded line hands over
	 * to its dashed projection belongs to one of the two, not both).
	 */
	readonly tip?: boolean | ((datum: TDatum, index: number) => boolean);
	readonly opacity?: number;
}

export function markId(
	id: string | undefined,
	kind: string,
	context: ChartMarkContext,
): string {
	return id ?? `${kind}-${context.markIndex}`;
}

/** A datum's series: its color value when there is a color channel, the mark otherwise. */
export interface SeriesInfo {
	readonly key: string;
	readonly label: string | undefined;
	readonly color: string;
}

export function seriesResolver<TDatum>(
	colors: ReadonlyArray<ChartValue | undefined>,
	options: ChartMarkOptions<TDatum> & { readonly fixedColor?: string },
	id: string,
	context: ChartMarkContext,
): (index: number) => SeriesInfo {
	const fallback =
		options.fixedColor ?? context.paletteColor(context.markIndex);
	const single: SeriesInfo = { key: id, label: options.label, color: fallback };
	if (options.color === undefined) {
		return () => single;
	}
	return (index) => {
		const value = colors[index];
		if (value === undefined) {
			return single;
		}
		return {
			key: categoryKey(value),
			label: context.seriesLabel(value),
			color: options.fixedColor ?? context.colorOf(value),
		};
	};
}

export function colorChannel<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: ChartMarkOptions<TDatum>,
): {
	readonly values: ReadonlyArray<ChartValue | undefined>;
	readonly channel: ChartChannel | undefined;
} {
	const values = readChannel(data, options.color);
	return {
		values,
		channel:
			options.color === undefined
				? undefined
				: {
						values: values.filter(isPlaceable),
						label: channelLabel(options.color),
					},
	};
}

/** Keeps only the defined paint keys, so a scene snapshot shows what was asked for. */
export function paint<TPaint extends ChartPaint>(values: TPaint): TPaint {
	return Object.fromEntries(
		Object.entries(values).filter(([, value]) => value !== undefined),
	) as TPaint;
}

/** Indices of `data` grouped by series, each group in data order. */
export function groupBySeries(
	count: number,
	seriesOf: (index: number) => SeriesInfo,
): ReadonlyMap<
	string,
	{ readonly series: SeriesInfo; readonly indices: number[] }
> {
	const groups = new Map<string, { series: SeriesInfo; indices: number[] }>();
	for (let index = 0; index < count; index += 1) {
		const series = seriesOf(index);
		const group = groups.get(series.key);
		if (group === undefined) {
			groups.set(series.key, { series, indices: [index] });
		} else {
			group.indices.push(index);
		}
	}
	return groups;
}

/**
 * A raw channel value as the scale can place it, or `undefined` for a gap. A
 * continuous scale reads numeric strings as numbers; a discrete one takes any
 * category as is.
 */
export function valueOn(
	scale: ChartPositionScale,
	raw: unknown,
): ChartValue | undefined {
	if (scale.kind === "band" || scale.kind === "point") {
		return isPlaceable(raw) ? raw : undefined;
	}
	if (raw instanceof Date) {
		return Number.isNaN(raw.getTime()) ? undefined : raw;
	}
	return numericValue(raw);
}

/** Whether a datum takes part in focus, tooltips and the data table. */
export function tips<TDatum>(
	tip: ChartMarkOptions<TDatum>["tip"],
	datum: TDatum,
	index: number,
): boolean {
	return typeof tip === "function" ? tip(datum, index) : tip !== false;
}
