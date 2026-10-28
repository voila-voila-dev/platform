import { channelLabel, isPlaceable, readChannel } from "#/core/channel.ts";
import {
	type ChartMarkOptions,
	colorChannel,
	groupBySeries,
	markId,
	paint,
	seriesResolver,
	tips,
	valueOn,
} from "#/core/marks/shared.ts";
import { POINTS_MOTION, pointsPath } from "#/core/motion/points-motion.ts";
import { categoryKey } from "#/core/scales/discrete.ts";
import type {
	ChartAccessor,
	ChartCurve,
	ChartMark,
	ChartPoint,
	ChartValue,
	GeometryPoint,
	SceneNode,
} from "#/core/types.ts";

export interface LineOptions<TDatum> extends ChartMarkOptions<TDatum> {
	readonly x?: ChartAccessor<TDatum, ChartValue>;
	readonly y?: ChartAccessor<TDatum, ChartValue>;
	readonly stroke?: string;
	readonly strokeWidth?: number;
	readonly strokeDasharray?: string;
	readonly curve?: ChartCurve;
	/** A dot on every point, not only on the focused one. */
	readonly dots?: boolean;
}

const DEFAULT_STROKE_WIDTH = 2;
const DOT_RADIUS = 3;

/** With no accessor, a line of plain numbers plots each against its index. */
function positionAccessor<TDatum>(
	accessor: ChartAccessor<TDatum, ChartValue> | undefined,
	fallback: "index" | "identity",
): ChartAccessor<TDatum, ChartValue> {
	if (accessor !== undefined) {
		return accessor;
	}
	return fallback === "index"
		? (_datum, index) => index
		: (datum) => datum as unknown as ChartValue;
}

function lineMark<TDatum>(
	kind: "lineY" | "lineX",
	data: ReadonlyArray<TDatum>,
	options: LineOptions<TDatum>,
): ChartMark {
	// lineY: the value runs up the y axis; lineX: along x, positions down y.
	const vertical = kind === "lineY";
	const positionKey = vertical ? options.x : options.y;
	const valueKey = vertical ? options.y : options.x;
	const positions = readChannel(data, positionAccessor(positionKey, "index"));
	const values = readChannel(data, positionAccessor(valueKey, "identity"));
	const colors = colorChannel(data, options);
	const positionChannel = {
		values: positions.filter(isPlaceable),
		label: channelLabel(positionKey),
	};
	const valueChannel = {
		values: values.filter(isPlaceable),
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
				{ ...options, fixedColor: options.stroke },
				id,
				context,
			);
			const lines: SceneNode[] = [];
			const dots: SceneNode[] = [];
			const points: ChartPoint[] = [];

			for (const { series, indices } of groupBySeries(
				data.length,
				seriesOf,
			).values()) {
				// A gap in the data is a gap in the line, not a dive to zero.
				const runs: GeometryPoint[][] = [[]];
				for (const index of indices) {
					const position = positions[index];
					const value = valueOn(valueScale, values[index]);
					if (!isPlaceable(position) || value === undefined) {
						runs.push([]);
						continue;
					}
					const along = positionScale.center(position);
					const across = valueScale.center(value);
					const xy = vertical
						? { x: along, y: across }
						: { x: across, y: along };
					runs[runs.length - 1].push({ key: categoryKey(position), ...xy });
					if (tips(options.tip, data[index], index)) {
						points.push({
							key: `${id}:${index}`,
							markId: id,
							index,
							datum: data[index],
							x: xy.x,
							y: xy.y,
							xValue: vertical ? position : value,
							yValue: vertical ? value : position,
							series: series.key,
							seriesLabel: series.label,
							color: series.color,
							title: vertical
								? context.formatX(position)
								: context.formatY(position),
							value: vertical ? context.formatY(value) : context.formatX(value),
						});
					}
					if (options.dots) {
						dots.push({
							kind: "circle",
							key: `${id}:dot:${index}`,
							series: series.key,
							role: "mark",
							cx: xy.x,
							cy: xy.y,
							r: DOT_RADIUS,
							paint: paint({
								fill: series.color,
								stroke: context.theme.background,
								strokeWidth: 1.5,
								opacity: options.opacity,
							}),
						});
					}
				}
				const geometry = {
					kind: "points" as const,
					runs: runs.filter((run) => run.length > 1),
					shape: "line" as const,
					curve: options.curve,
				};
				lines.push({
					kind: "path",
					key: `${id}:line:${series.key}`,
					series: series.key,
					role: "mark",
					d: pointsPath(geometry),
					geometry,
					motion: POINTS_MOTION,
					enter: options.enter,
					paint: paint({
						stroke: series.color,
						strokeWidth: options.strokeWidth ?? DEFAULT_STROKE_WIDTH,
						strokeDasharray: options.strokeDasharray,
						strokeLinecap: "round",
						strokeLinejoin: "round",
						fill: "none",
						opacity: options.opacity,
					}),
				});
			}

			const legend =
				options.color === undefined && options.label !== undefined
					? [
							{
								key: id,
								label: options.label,
								color:
									options.stroke ?? context.paletteColor(context.markIndex),
								shape: options.strokeDasharray
									? ("dashed" as const)
									: ("line" as const),
							},
						]
					: [];
			return { nodes: [...lines, ...dots], points, legend };
		},
	};
}

/** A line whose value runs up the y axis, over x positions: a time series. */
export function lineY<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: LineOptions<TDatum> = {},
): ChartMark {
	return lineMark("lineY", data, options);
}

/** A line whose value runs along x, over y positions. */
export function lineX<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: LineOptions<TDatum> = {},
): ChartMark {
	return lineMark("lineX", data, options);
}
