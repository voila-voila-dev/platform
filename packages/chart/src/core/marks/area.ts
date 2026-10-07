import {
	channelLabel,
	isPlaceable,
	numericValue,
	readChannel,
} from "#/core/channel.ts";
import {
	type ChartMarkOptions,
	colorChannel,
	groupBySeries,
	markId,
	paint,
	seriesResolver,
} from "#/core/marks/shared.ts";
import { stackSegments } from "#/core/marks/stack.ts";
import { areaPath, type ChartXY, linePath } from "#/core/paths.ts";
import { categoryKey } from "#/core/scales/discrete.ts";
import type {
	ChartAccessor,
	ChartCurve,
	ChartMark,
	ChartPoint,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface AreaOptions<TDatum> extends ChartMarkOptions<TDatum> {
	readonly x?: ChartAccessor<TDatum, ChartValue>;
	readonly y?: ChartAccessor<TDatum, ChartValue>;
	/** Explicit lower and upper edges: a confidence band, a min-max range. */
	readonly from?: ChartAccessor<TDatum, ChartValue>;
	readonly to?: ChartAccessor<TDatum, ChartValue>;
	readonly fill?: string;
	readonly fillOpacity?: number;
	/** Draw the upper edge as a line in the series colour. */
	readonly line?: boolean;
	readonly strokeWidth?: number;
	readonly strokeDasharray?: string;
	readonly curve?: ChartCurve;
	/** Series stack on one another. On by default when there is a color channel. */
	readonly stack?: boolean;
}

const DEFAULT_FILL_OPACITY = 0.3;
const DEFAULT_STROKE_WIDTH = 2;

function areaMark<TDatum>(
	kind: "areaY" | "areaX",
	data: ReadonlyArray<TDatum>,
	options: AreaOptions<TDatum>,
): ChartMark {
	const vertical = kind === "areaY";
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
	const stacked = !explicit && (options.stack ?? options.color !== undefined);
	const segments = stacked
		? stackSegments(
				positions.map((position) =>
					isPlaceable(position) ? categoryKey(position) : undefined,
				),
				values,
			)
		: [];
	const edges = positions.map((position, index) => {
		if (!isPlaceable(position)) {
			return undefined;
		}
		if (explicit) {
			const low = froms[index];
			const high = tos[index];
			return low === undefined || high === undefined
				? undefined
				: { low, high };
		}
		const value = values[index];
		if (value === undefined) {
			return undefined;
		}
		return segments[index] ?? { low: 0, high: value };
	});

	const positionChannel = {
		values: positions.filter(isPlaceable),
		label: channelLabel(positionKey),
	};
	const valueChannel = {
		values: edges.flatMap((edge) => (edge ? [edge.low, edge.high] : [])),
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
			function place(along: number, value: number): ChartXY {
				const across = valueScale?.map(value) ?? 0;
				return vertical ? { x: along, y: across } : { x: across, y: along };
			}

			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const { series, indices } of groupBySeries(
				data.length,
				seriesOf,
			).values()) {
				const runs: Array<{ top: ChartXY[]; bottom: ChartXY[] }> = [
					{ top: [], bottom: [] },
				];
				for (const index of indices) {
					const position = positions[index];
					const edge = edges[index];
					if (!isPlaceable(position) || edge === undefined) {
						runs.push({ top: [], bottom: [] });
						continue;
					}
					const along = positionScale.center(position);
					const top = place(along, edge.high);
					const run = runs[runs.length - 1];
					run.top.push(top);
					run.bottom.push(place(along, edge.low));
					if (options.tip === false) {
						continue;
					}
					const value = explicit ? edge.high : (values[index] ?? 0);
					points.push({
						key: `${id}:${index}`,
						markId: id,
						index,
						datum: data[index],
						x: top.x,
						y: top.y,
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
				const shaped = runs.filter((run) => run.top.length > 0);
				nodes.push({
					kind: "path",
					key: `${id}:area:${series.key}`,
					series: series.key,
					role: "mark",
					d: shaped
						.map((run) => areaPath(run.top, run.bottom, options.curve))
						.join(""),
					paint: paint({
						fill: series.color,
						fillOpacity: options.fillOpacity ?? DEFAULT_FILL_OPACITY,
						opacity: options.opacity,
					}),
				});
				if (options.line) {
					nodes.push({
						kind: "path",
						key: `${id}:line:${series.key}`,
						series: series.key,
						role: "mark",
						d: shaped.map((run) => linePath(run.top, options.curve)).join(""),
						paint: paint({
							fill: "none",
							stroke: series.color,
							strokeWidth: options.strokeWidth ?? DEFAULT_STROKE_WIDTH,
							strokeDasharray: options.strokeDasharray,
							strokeLinecap: "round",
							strokeLinejoin: "round",
							opacity: options.opacity,
						}),
					});
				}
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

/** A filled band under a series, over x positions. */
export function areaY<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: AreaOptions<TDatum> = {},
): ChartMark {
	return areaMark("areaY", data, options);
}

/** A filled band along x, over y positions. */
export function areaX<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: AreaOptions<TDatum> = {},
): ChartMark {
	return areaMark("areaX", data, options);
}
