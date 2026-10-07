import {
	channelLabel,
	isPlaceable,
	numericValue,
	readChannel,
} from "#/core/channel.ts";
import {
	type ChartMarkOptions,
	colorChannel,
	markId,
	paint,
	seriesResolver,
} from "#/core/marks/shared.ts";
import { stackSegments } from "#/core/marks/stack.ts";
import { categoryKey } from "#/core/scales/discrete.ts";
import type {
	ChartAccessor,
	ChartCorners,
	ChartMark,
	ChartPoint,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface BarOptions<TDatum> extends ChartMarkOptions<TDatum> {
	readonly x?: ChartAccessor<TDatum, ChartValue>;
	readonly y?: ChartAccessor<TDatum, ChartValue>;
	/** Explicit start and end of the bar on the value axis: floating bars, ranges, Gantt rows. */
	readonly from?: ChartAccessor<TDatum, ChartValue>;
	readonly to?: ChartAccessor<TDatum, ChartValue>;
	readonly fill?: string;
	readonly fillOpacity?: number;
	readonly stroke?: string;
	readonly strokeDasharray?: string;
	/** Series stack on one another. On by default when there is a color channel. */
	readonly stack?: boolean;
	/** Series stand side by side inside the band instead of stacking. */
	readonly group?: boolean;
	/** Corner radius of the bar's far end. */
	readonly radius?: number;
	/** Pixels kept clear on each side of the bar inside its band. */
	readonly inset?: number;
}

const DEFAULT_RADIUS = 4;

interface BarDatum {
	readonly index: number;
	readonly position: ChartValue;
	readonly low: number;
	readonly high: number;
	readonly value: number;
	/** Round the far end: the outer segment of a stack, or any unstacked bar. */
	readonly outer: boolean;
}

function barMark<TDatum>(
	kind: "barY" | "barX",
	data: ReadonlyArray<TDatum>,
	options: BarOptions<TDatum>,
): ChartMark {
	const vertical = kind === "barY";
	const positionKey = vertical ? options.x : options.y;
	const valueKey = vertical ? options.y : options.x;
	const positions = readChannel(
		data,
		positionKey ?? ((_datum: TDatum, index: number) => index),
	);
	const values = readChannel(
		data,
		valueKey ?? ((datum: TDatum) => datum as unknown as ChartValue),
	).map(numericValue);
	const colors = colorChannel(data, options);
	const explicit = options.from !== undefined && options.to !== undefined;
	const froms = readChannel(data, options.from).map(numericValue);
	const tos = readChannel(data, options.to).map(numericValue);
	const stacked =
		!explicit &&
		!options.group &&
		(options.stack ?? options.color !== undefined);
	const segments = stacked
		? stackSegments(
				positions.map((position) =>
					isPlaceable(position) ? categoryKey(position) : undefined,
				),
				values,
			)
		: [];

	const bars: BarDatum[] = [];
	for (const [index, position] of positions.entries()) {
		if (!isPlaceable(position)) {
			continue;
		}
		if (explicit) {
			const low = froms[index];
			const high = tos[index];
			if (low !== undefined && high !== undefined) {
				bars.push({
					index,
					position,
					low,
					high,
					value: high - low,
					outer: true,
				});
			}
			continue;
		}
		const value = values[index];
		if (value === undefined) {
			continue;
		}
		const segment = segments[index];
		bars.push(
			segment === undefined
				? { index, position, low: 0, high: value, value, outer: true }
				: { index, position, ...segment, value },
		);
	}

	const positionChannel = {
		values: bars.map((bar) => bar.position),
		discrete: "band" as const,
		label: channelLabel(positionKey),
	};
	const valueChannel = {
		values: bars.flatMap((bar) => [bar.low, bar.high]),
		includeZero: !explicit,
		label: channelLabel(valueKey) ?? options.label,
	};

	return {
		id: options.id,
		coordinate: "cartesian",
		focusOrder: vertical ? "x" : "y",
		channels: {
			x: vertical ? positionChannel : valueChannel,
			y: vertical ? valueChannel : positionChannel,
			color: colors.channel,
		},
		render(context) {
			const id = markId(options.id, kind, context);
			const positionScale = vertical ? context.scales.x : context.scales.y;
			const valueScale = vertical ? context.scales.y : context.scales.x;
			if (positionScale === undefined || valueScale === undefined) {
				return { nodes: [] };
			}
			const seriesOf = seriesResolver(
				colors.values,
				{ ...options, fixedColor: options.fill },
				id,
				context,
			);
			const seriesOrder = [
				...new Set(bars.map((bar) => seriesOf(bar.index).key)),
			];
			const lanes = options.group ? Math.max(1, seriesOrder.length) : 1;
			const laneWidth = positionScale.bandwidth / lanes;
			const inset = options.inset ?? 0;
			const radius = options.radius ?? DEFAULT_RADIUS;

			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const bar of bars) {
				const series = seriesOf(bar.index);
				const lane = options.group ? seriesOrder.indexOf(series.key) : 0;
				const alongStart =
					positionScale.map(bar.position) + lane * laneWidth + inset;
				const alongSize = Math.max(0, laneWidth - inset * 2);
				const lowPixel = valueScale.map(bar.low);
				const highPixel = valueScale.map(bar.high);
				const acrossStart = Math.min(lowPixel, highPixel);
				const acrossSize = Math.abs(highPixel - lowPixel);
				const rect = vertical
					? {
							x: alongStart,
							y: acrossStart,
							width: alongSize,
							height: acrossSize,
						}
					: {
							x: acrossStart,
							y: alongStart,
							width: acrossSize,
							height: alongSize,
						};
				nodes.push({
					kind: "rect",
					key: `${id}:${bar.index}`,
					series: series.key,
					role: "mark",
					...rect,
					corners: corners(vertical, bar, radius, explicit),
					paint: paint({
						fill: series.color,
						fillOpacity: options.fillOpacity,
						stroke: options.stroke,
						strokeDasharray: options.strokeDasharray,
						opacity: options.opacity,
					}),
				});
				if (options.tip === false) {
					continue;
				}
				const along = alongStart + alongSize / 2;
				points.push({
					key: `${id}:${bar.index}`,
					markId: id,
					index: bar.index,
					datum: data[bar.index],
					x: vertical ? along : highPixel,
					y: vertical ? highPixel : along,
					xValue: vertical ? bar.position : bar.value,
					yValue: vertical ? bar.value : bar.position,
					series: series.key,
					seriesLabel: series.label,
					color: series.color,
					title: vertical
						? context.formatX(bar.position)
						: context.formatY(bar.position),
					value: vertical
						? context.formatY(bar.value)
						: context.formatX(bar.value),
					hit: { kind: "rect", rect },
				});
			}
			const legend =
				options.color === undefined && options.label !== undefined
					? [
							{
								key: id,
								label: options.label,
								color: options.fill ?? context.paletteColor(context.markIndex),
								shape: "square" as const,
							},
						]
					: [];
			return { nodes, points, legend };
		},
	};
}

/** Rounds the end of the bar away from zero, and only that end: stacked joins stay square. */
function corners(
	vertical: boolean,
	bar: BarDatum,
	radius: number,
	explicit: boolean,
): ChartCorners | undefined {
	if (radius === 0 || !bar.outer) {
		return undefined;
	}
	if (explicit) {
		return [radius, radius, radius, radius];
	}
	const positive = bar.high >= bar.low;
	if (vertical) {
		return positive ? [radius, radius, 0, 0] : [0, 0, radius, radius];
	}
	return positive ? [0, radius, radius, 0] : [radius, 0, 0, radius];
}

/** Upright bars: categories along x, values up y. */
export function barY<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: BarOptions<TDatum> = {},
): ChartMark {
	return barMark("barY", data, options);
}

/** Bars on their side: categories down y, values along x. */
export function barX<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: BarOptions<TDatum> = {},
): ChartMark {
	return barMark("barX", data, options);
}
