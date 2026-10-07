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
import type {
	ChartAccessor,
	ChartMark,
	ChartPoint,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface DotOptions<TDatum> extends ChartMarkOptions<TDatum> {
	readonly x?: ChartAccessor<TDatum, ChartValue>;
	readonly y?: ChartAccessor<TDatum, ChartValue>;
	/** A radius in pixels, or a field whose values set the area of each dot. */
	readonly r?: number | ChartAccessor<TDatum, ChartValue>;
	/** The largest radius a sized dot reaches. */
	readonly maxRadius?: number;
	readonly fill?: string;
	readonly fillOpacity?: number;
	readonly stroke?: string;
	readonly strokeWidth?: number;
}

const DEFAULT_RADIUS = 4;
const DEFAULT_MAX_RADIUS = 16;

/** A dot per datum: a scatter plot, or a bubble chart when `r` is a field. */
export function dot<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: DotOptions<TDatum> = {},
): ChartMark {
	const xs = readChannel(
		data,
		options.x ?? ((_datum: TDatum, index: number) => index),
	);
	const ys = readChannel(
		data,
		options.y ?? ((datum: TDatum) => datum as unknown as ChartValue),
	);
	const colors = colorChannel(data, options);
	const sized = options.r !== undefined && typeof options.r !== "number";
	const sizes = sized
		? readChannel(data, options.r as ChartAccessor<TDatum, ChartValue>).map(
				numericValue,
			)
		: [];
	const largest = Math.max(0, ...sizes.map((size) => Math.abs(size ?? 0)));
	const reach =
		typeof options.r === "number"
			? options.r
			: sized
				? (options.maxRadius ?? DEFAULT_MAX_RADIUS)
				: DEFAULT_RADIUS;

	return {
		id: options.id,
		coordinate: "cartesian",
		focusOrder: "point",
		channels: {
			x: {
				values: xs.filter(isPlaceable),
				label: channelLabel(options.x),
				inset: reach,
			},
			y: {
				values: ys.filter(isPlaceable),
				label: channelLabel(options.y) ?? options.label,
				inset: reach,
			},
			color: colors.channel,
		},
		render(context) {
			const id = markId(options.id, "dot", context);
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
			const maxRadius = options.maxRadius ?? DEFAULT_MAX_RADIUS;
			// Area, not radius, carries the value: a dot twice the value looks twice as big.
			function radiusOf(index: number): number {
				if (typeof options.r === "number") return options.r;
				if (!sized) return DEFAULT_RADIUS;
				const size = Math.abs(sizes[index] ?? 0);
				return largest === 0 ? 0 : Math.sqrt(size / largest) * maxRadius;
			}
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [index, datum] of data.entries()) {
				const xValue = valueOn(xScale, xs[index]);
				const yValue = valueOn(yScale, ys[index]);
				if (xValue === undefined || yValue === undefined) {
					continue;
				}
				const series = seriesOf(index);
				const cx = xScale.center(xValue);
				const cy = yScale.center(yValue);
				const r = radiusOf(index);
				nodes.push({
					kind: "circle",
					key: `${id}:${index}`,
					series: series.key,
					role: "mark",
					cx,
					cy,
					r,
					paint: paint({
						fill: series.color,
						fillOpacity: options.fillOpacity,
						stroke: options.stroke,
						strokeWidth: options.strokeWidth,
						opacity: options.opacity,
					}),
				});
				if (options.tip !== false) {
					points.push({
						key: `${id}:${index}`,
						markId: id,
						index,
						datum,
						x: cx,
						y: cy,
						xValue,
						yValue,
						series: series.key,
						seriesLabel: series.label,
						color: series.color,
						title: context.formatX(xValue),
						value: context.formatY(yValue),
						hit: {
							kind: "rect",
							rect: { x: cx - r, y: cy - r, width: r * 2, height: r * 2 },
						},
					});
				}
			}
			return { nodes, points };
		},
	};
}
