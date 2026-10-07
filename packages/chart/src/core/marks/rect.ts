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
	valueOn,
} from "#/core/marks/shared.ts";
import { stackSegments } from "#/core/marks/stack.ts";
import { categoryKey } from "#/core/scales/discrete.ts";
import type {
	ChartAccessor,
	ChartMark,
	ChartPoint,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface RectOptions<TDatum> extends ChartMarkOptions<TDatum> {
	/** Start and end of the rectangle along a continuous x: a bin, a period. */
	readonly x1: ChartAccessor<TDatum, ChartValue>;
	readonly x2: ChartAccessor<TDatum, ChartValue>;
	/** Its height. Stacks by colour like bars. */
	readonly y: ChartAccessor<TDatum, ChartValue>;
	readonly fill?: string;
	readonly fillOpacity?: number;
	/** Pixels kept clear on each side, so neighbours read as separate. */
	readonly inset?: number;
	readonly stack?: boolean;
	readonly radius?: number;
}

/**
 * A rectangle between two x values, as tall as its value: the bars of a
 * histogram, periods on a timeline. Unlike `barY` the x axis stays
 * continuous, so the bins keep their true widths.
 */
export function rectY<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: RectOptions<TDatum>,
): ChartMark {
	const starts = readChannel(data, options.x1);
	const ends = readChannel(data, options.x2);
	const values = readChannel(data, options.y).map(numericValue);
	const colors = colorChannel(data, options);
	const stacked = options.stack ?? options.color !== undefined;
	const segments = stacked
		? stackSegments(
				starts.map((start) =>
					isPlaceable(start) ? categoryKey(start) : undefined,
				),
				values,
			)
		: [];
	const edges = values.map((value, index) =>
		value === undefined
			? undefined
			: (segments[index] ?? { low: 0, high: value, outer: true }),
	);
	return {
		id: options.id,
		coordinate: "cartesian",
		focusOrder: "x",
		channels: {
			x: {
				values: [...starts, ...ends].filter(isPlaceable),
				label: channelLabel(options.x1),
			},
			y: {
				values: edges.flatMap((edge) => (edge ? [edge.low, edge.high] : [])),
				includeZero: true,
				label: channelLabel(options.y) ?? options.label,
			},
			color: colors.channel,
		},
		render(context) {
			const id = markId(options.id, "rectY", context);
			const { x: xScale, y: yScale } = context.scales;
			if (xScale === undefined || yScale === undefined) {
				return { nodes: [] };
			}
			const seriesOf = seriesResolver(
				colors.values,
				{ ...options, fixedColor: options.fill },
				id,
				context,
			);
			const inset = options.inset ?? 0.5;
			const radius = options.radius ?? 0;
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [index, edge] of edges.entries()) {
				const start = valueOn(xScale, starts[index]);
				const end = valueOn(xScale, ends[index]);
				const value = values[index];
				if (
					edge === undefined ||
					start === undefined ||
					end === undefined ||
					value === undefined
				) {
					continue;
				}
				const left = Math.min(xScale.map(start), xScale.map(end)) + inset;
				const right = Math.max(xScale.map(start), xScale.map(end)) - inset;
				const top = Math.min(yScale.map(edge.low), yScale.map(edge.high));
				const rect = {
					x: left,
					y: top,
					width: Math.max(0, right - left),
					height: Math.abs(yScale.map(edge.high) - yScale.map(edge.low)),
				};
				const series = seriesOf(index);
				nodes.push({
					kind: "rect",
					key: `${id}:${index}`,
					series: series.key,
					role: "mark",
					...rect,
					corners:
						radius > 0 && edge.outer ? [radius, radius, 0, 0] : undefined,
					paint: paint({
						fill: series.color,
						fillOpacity: options.fillOpacity,
						opacity: options.opacity,
					}),
				});
				if (options.tip !== false) {
					points.push({
						key: `${id}:${index}`,
						markId: id,
						index,
						datum: data[index],
						x: rect.x + rect.width / 2,
						y: top,
						xValue: start,
						yValue: value,
						series: series.key,
						seriesLabel: series.label,
						color: series.color,
						title: `${context.formatX(start)} – ${context.formatX(end)}`,
						value: context.formatY(value),
						hit: { kind: "rect", rect },
					});
				}
			}
			return { nodes, points };
		},
	};
}
