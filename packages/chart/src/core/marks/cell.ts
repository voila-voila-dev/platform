import { channelLabel, isPlaceable, readChannel } from "#/core/channel.ts";
import { formatValue } from "#/core/format.ts";
import {
	type ChartMarkOptions,
	colorChannel,
	markId,
	paint,
	seriesResolver,
	valueOn,
} from "#/core/marks/shared.ts";
import type {
	ChartAccessor,
	ChartMark,
	ChartPoint,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface CellOptions<TDatum> extends ChartMarkOptions<TDatum> {
	readonly x?: ChartAccessor<TDatum, ChartValue>;
	readonly y?: ChartAccessor<TDatum, ChartValue>;
	readonly fill?: string;
	/** Pixels kept clear around each cell. */
	readonly inset?: number;
	readonly radius?: number;
}

const DEFAULT_INSET = 1;
const DEFAULT_RADIUS = 2;

/**
 * A rectangle per (x, y) pair of categories, filled by its color value: a
 * heatmap, a calendar, a matrix.
 */
export function cell<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: CellOptions<TDatum>,
): ChartMark {
	const xs = readChannel(data, options.x);
	const ys = readChannel(data, options.y);
	const colors = colorChannel(data, options);
	return {
		id: options.id,
		coordinate: "cartesian",
		focusOrder: "point",
		channels: {
			x: {
				values: xs.filter(isPlaceable),
				discrete: "band",
				padding: 0,
				label: channelLabel(options.x),
			},
			y: {
				values: ys.filter(isPlaceable),
				discrete: "band",
				padding: 0,
				label: channelLabel(options.y),
			},
			color: colors.channel,
		},
		render(context) {
			const id = markId(options.id, "cell", context);
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
			const inset = options.inset ?? DEFAULT_INSET;
			const radius = options.radius ?? DEFAULT_RADIUS;
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [index, datum] of data.entries()) {
				const xValue = valueOn(xScale, xs[index]);
				const yValue = valueOn(yScale, ys[index]);
				if (xValue === undefined || yValue === undefined) {
					continue;
				}
				const rect = {
					x: xScale.map(xValue) + inset,
					y: yScale.map(yValue) + inset,
					width: Math.max(0, xScale.bandwidth - inset * 2),
					height: Math.max(0, yScale.bandwidth - inset * 2),
				};
				const series = seriesOf(index);
				const colorValue = colors.values[index];
				nodes.push({
					kind: "rect",
					key: `${id}:${index}`,
					role: "mark",
					...rect,
					corners: [radius, radius, radius, radius],
					paint: paint({ fill: series.color, opacity: options.opacity }),
				});
				if (options.tip !== false) {
					points.push({
						key: `${id}:${index}`,
						markId: id,
						index,
						datum,
						x: rect.x + rect.width / 2,
						y: rect.y + rect.height / 2,
						xValue,
						yValue,
						color: series.color,
						seriesLabel: options.label,
						title: `${context.formatX(xValue)} · ${context.formatY(yValue)}`,
						value:
							colorValue === undefined
								? ""
								: formatValue(colorValue, context.locale),
						hit: { kind: "rect", rect },
					});
				}
			}
			return { nodes, points };
		},
	};
}
