import { channelLabel, isPlaceable, readChannel } from "#/core/channel.ts";
import {
	type ChartMarkOptions,
	colorChannel,
	markId,
	paint,
	seriesResolver,
	tips,
	valueOn,
} from "#/core/marks/shared.ts";
import type {
	ChartAccessor,
	ChartMark,
	ChartPoint,
	ChartPositionScale,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface TickOptions<TDatum> extends ChartMarkOptions<TDatum> {
	readonly x?: ChartAccessor<TDatum, ChartValue>;
	readonly y?: ChartAccessor<TDatum, ChartValue>;
	readonly stroke?: string;
	readonly strokeWidth?: number;
	/** The tick's length in pixels where the cross axis is continuous; on a band it spans the band. */
	readonly length?: number;
}

const DEFAULT_LENGTH = 12;
const DEFAULT_STROKE_WIDTH = 2;

/** Where the tick spans on the cross axis: the band, or `length` around the value. */
function span(
	scale: ChartPositionScale | undefined,
	value: ChartValue | undefined,
	length: number,
	plot: { readonly start: number; readonly size: number },
): readonly [number, number] {
	if (scale === undefined || value === undefined) {
		return [plot.start, plot.start + plot.size];
	}
	if (scale.kind === "band") {
		const start = scale.map(value);
		return [start, start + scale.bandwidth];
	}
	const center = scale.center(value);
	return [center - length / 2, center + length / 2];
}

function tickMark<TDatum>(
	kind: "tickX" | "tickY",
	data: ReadonlyArray<TDatum>,
	options: TickOptions<TDatum>,
): ChartMark {
	const vertical = kind === "tickX";
	const xs = readChannel(data, options.x);
	const ys = readChannel(data, options.y);
	const colors = colorChannel(data, options);
	const valueKey = vertical ? options.x : options.y;
	const crossKey = vertical ? options.y : options.x;
	const values = vertical ? xs : ys;
	const crosses = vertical ? ys : xs;

	return {
		id: options.id,
		coordinate: "cartesian",
		focusOrder: "point",
		channels: {
			[vertical ? "x" : "y"]: {
				values: values.filter(isPlaceable),
				label: channelLabel(valueKey) ?? options.label,
			},
			...(crossKey === undefined
				? {}
				: {
						[vertical ? "y" : "x"]: {
							values: crosses.filter(isPlaceable),
							label: channelLabel(crossKey),
							discrete: "band" as const,
						},
					}),
			color: colors.channel,
		},
		render(context) {
			const id = markId(options.id, kind, context);
			const valueScale = vertical ? context.scales.x : context.scales.y;
			const crossScale = vertical ? context.scales.y : context.scales.x;
			if (valueScale === undefined) {
				return { nodes: [] };
			}
			const { plot } = context;
			const seriesOf = seriesResolver(
				colors.values,
				{ ...options, fixedColor: options.stroke },
				id,
				context,
			);
			const length = options.length ?? DEFAULT_LENGTH;
			const strokeWidth = options.strokeWidth ?? DEFAULT_STROKE_WIDTH;
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [index, datum] of data.entries()) {
				const value = valueOn(valueScale, values[index]);
				if (value === undefined) {
					continue;
				}
				const cross =
					crossKey === undefined || crossScale === undefined
						? undefined
						: valueOn(crossScale, crosses[index]);
				if (crossKey !== undefined && cross === undefined) {
					continue;
				}
				const at = valueScale.center(value);
				const [from, to] = span(
					crossKey === undefined ? undefined : crossScale,
					cross,
					length,
					vertical
						? { start: plot.y, size: plot.height }
						: { start: plot.x, size: plot.width },
				);
				const series = seriesOf(index);
				nodes.push({
					kind: "line",
					key: `${id}:${index}`,
					series: series.key,
					role: "mark",
					...(vertical
						? { x1: at, y1: from, x2: at, y2: to }
						: { x1: from, y1: at, x2: to, y2: at }),
					paint: paint({
						stroke: series.color,
						strokeWidth,
						opacity: options.opacity,
					}),
				});
				if (tips(options.tip, datum, index)) {
					const middle = (from + to) / 2;
					const xValue = vertical ? value : cross;
					const yValue = vertical ? cross : value;
					points.push({
						key: `${id}:${index}`,
						markId: id,
						index,
						datum,
						x: vertical ? at : middle,
						y: vertical ? middle : at,
						xValue,
						yValue,
						series: series.key,
						seriesLabel: series.label,
						color: series.color,
						title:
							cross === undefined
								? (series.label ?? "")
								: vertical
									? context.formatY(cross)
									: context.formatX(cross),
						value: vertical ? context.formatX(value) : context.formatY(value),
						hit: {
							kind: "rect",
							rect: vertical
								? { x: at - 4, y: from, width: 8, height: to - from }
								: { x: from, y: at - 4, width: to - from, height: 8 },
						},
					});
				}
			}
			return { nodes, points };
		},
	};
}

/** A short vertical stroke at each x: a strip plot, a rug, one value per category band. */
export function tickX<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: TickOptions<TDatum> = {},
): ChartMark {
	return tickMark("tickX", data, options);
}

/** A short horizontal stroke at each y: a target per bar, a median per category. */
export function tickY<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: TickOptions<TDatum> = {},
): ChartMark {
	return tickMark("tickY", data, options);
}
