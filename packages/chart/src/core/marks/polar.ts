import {
	channelLabel,
	isPlaceable,
	numericValue,
	readChannel,
} from "#/core/channel.ts";
import { formatPercentage } from "#/core/format.ts";
import {
	type ChartMarkOptions,
	markId,
	paint,
	seriesResolver,
	tips,
} from "#/core/marks/shared.ts";
import {
	arcPath,
	type ChartXY,
	polarToCartesian,
	polygonPath,
} from "#/core/paths.ts";
import { categoryKey } from "#/core/scales/discrete.ts";
import { niceDomain } from "#/core/ticks.ts";
import type {
	ChartAccessor,
	ChartMark,
	ChartMarkContext,
	ChartPoint,
	ChartRect,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

/**
 * Round marks. They own the whole plot rather than sitting on x and y
 * scales; their slices are coloured by category, which is what the legend
 * lists. Angles are degrees clockwise from twelve o'clock.
 */

const FULL_TURN = 360;
const EDGE = 4;

interface Frame {
	readonly cx: number;
	readonly cy: number;
	readonly radius: number;
}

/**
 * The circle a round mark is drawn in: centred, as large as the plot allows
 * once `insetX` (left and right) and `insetY` (top and bottom) are kept clear
 * for labels drawn outside it.
 */
function frameOf(plot: ChartRect, insetX = 0, insetY = insetX): Frame {
	return {
		cx: plot.x + plot.width / 2,
		cy: plot.y + plot.height / 2,
		radius: Math.max(
			0,
			Math.min(plot.width / 2 - insetX, plot.height / 2 - insetY) - EDGE,
		),
	};
}

interface SliceAngle {
	readonly startAngle: number;
	readonly endAngle: number;
	readonly fraction: number;
}

/**
 * Splits a turn between values, proportionally. Negative values count as
 * zero: a pie of signed numbers has no honest reading.
 */
export function sliceAngles(
	values: ReadonlyArray<number>,
	padAngle = 0,
	startAngle = 0,
	endAngle = FULL_TURN,
): ReadonlyArray<SliceAngle> {
	const positives = values.map((value) =>
		Number.isFinite(value) && value > 0 ? value : 0,
	);
	const total = positives.reduce((sum, value) => sum + value, 0);
	const pads = positives.filter((value) => value > 0).length > 1 ? padAngle : 0;
	const available = Math.max(
		0,
		endAngle - startAngle - pads * positives.length,
	);
	let cursor = startAngle;
	return positives.map((value) => {
		const fraction = total === 0 ? 0 : value / total;
		const sweep = available * fraction;
		const slice = {
			startAngle: cursor + pads / 2,
			endAngle: cursor + pads / 2 + sweep,
			fraction,
		};
		cursor += sweep + pads;
		return slice;
	});
}

export interface ArcOptions<TDatum> extends ChartMarkOptions<TDatum> {
	/** The slice's name: what the legend, tooltip and table call it. */
	readonly category: ChartAccessor<TDatum, ChartValue>;
	readonly value: ChartAccessor<TDatum, ChartValue>;
	/** Share of the radius left empty in the middle: 0 is a pie, 0.6 a donut. */
	readonly innerRadius?: number;
	/** Degrees of blank between two slices. */
	readonly padAngle?: number;
	readonly startAngle?: number;
	readonly endAngle?: number;
	readonly fill?: string;
	readonly stroke?: string;
}

const DEFAULT_PAD_ANGLE = 1;

/** A pie, or a donut with `innerRadius`: each datum a slice of the whole. */
export function arc<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: ArcOptions<TDatum>,
): ChartMark {
	const categories = readChannel(data, options.category);
	const values = readChannel(data, options.value).map(numericValue);
	const colorAccessor = options.color ?? options.category;
	const colors = readChannel(data, colorAccessor);
	return {
		id: options.id,
		coordinate: "frame",
		titles: {
			category: channelLabel(options.category),
			value: channelLabel(options.value) ?? options.label,
		},
		channels: {
			color: {
				values: colors.filter(isPlaceable),
				label: channelLabel(colorAccessor),
			},
		},
		render(context) {
			const id = markId(options.id, "arc", context);
			const { cx, cy, radius } = frameOf(context.plot);
			const inner = radius * (options.innerRadius ?? 0);
			const angles = sliceAngles(
				values.map((value) => value ?? 0),
				options.padAngle ?? DEFAULT_PAD_ANGLE,
				options.startAngle,
				options.endAngle,
			);
			const seriesOf = seriesResolver(
				colors,
				{ ...options, color: colorAccessor, fixedColor: options.fill },
				id,
				context,
			);
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [index, angle] of angles.entries()) {
				const category = categories[index];
				const value = values[index];
				if (
					!isPlaceable(category) ||
					value === undefined ||
					angle.fraction === 0
				) {
					continue;
				}
				const series = seriesOf(index);
				const shape = {
					cx,
					cy,
					innerRadius: inner,
					outerRadius: radius,
					startAngle: angle.startAngle,
					endAngle: angle.endAngle,
				};
				nodes.push({
					kind: "path",
					key: `${id}:${categoryKey(category)}`,
					series: series.key,
					role: "mark",
					d: arcPath(shape),
					paint: paint({
						fill: series.color,
						stroke: options.stroke ?? context.theme.background,
						strokeWidth: options.stroke ? 1 : 0,
						opacity: options.opacity,
					}),
				});
				if (!tips(options.tip, data[index], index)) {
					continue;
				}
				const middle = (angle.startAngle + angle.endAngle) / 2;
				const anchor = polarToCartesian(cx, cy, (inner + radius) / 2, middle);
				points.push({
					key: `${id}:${categoryKey(category)}`,
					markId: id,
					index,
					datum: data[index],
					x: anchor.x,
					y: anchor.y,
					xValue: category,
					yValue: value,
					series: series.key,
					seriesLabel: options.label,
					color: series.color,
					title: series.label ?? context.formatX(category),
					value: `${context.formatY(value)} (${formatPercentage(angle.fraction, context.locale)})`,
					hit: { kind: "arc", ...shape },
				});
			}
			return { nodes, points };
		},
	};
}

/** A ring of slices: `arc` with the middle left empty. */
export function donut<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: ArcOptions<TDatum>,
): ChartMark {
	return arc(data, { innerRadius: 0.6, ...options });
}

export interface RadialBarOptions<TDatum> extends ChartMarkOptions<TDatum> {
	readonly category: ChartAccessor<TDatum, ChartValue>;
	readonly value: ChartAccessor<TDatum, ChartValue>;
	/** The value a full turn stands for. Defaults to the largest value, rounded up. */
	readonly max?: number;
	/** Share of the radius left empty in the middle. */
	readonly innerRadius?: number;
	/** Share of each ring's thickness left empty between two rings. */
	readonly gap?: number;
	/** Draw each ring's empty remainder, so the bars read against a full turn. */
	readonly track?: boolean;
	readonly fill?: string;
}

/** Concentric rings, each filled as far round as its value: progress against a common maximum. */
export function radialBar<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: RadialBarOptions<TDatum>,
): ChartMark {
	const categories = readChannel(data, options.category);
	const values = readChannel(data, options.value).map(numericValue);
	const colorAccessor = options.color ?? options.category;
	const colors = readChannel(data, colorAccessor);
	return {
		id: options.id,
		coordinate: "frame",
		titles: {
			category: channelLabel(options.category),
			value: channelLabel(options.value) ?? options.label,
		},
		channels: {
			color: {
				values: colors.filter(isPlaceable),
				label: channelLabel(colorAccessor),
			},
		},
		render(context) {
			const id = markId(options.id, "radialBar", context);
			const { cx, cy, radius } = frameOf(context.plot);
			const peak = Math.max(0, ...values.map((value) => value ?? 0));
			const max = options.max ?? niceDomain(0, peak)[1];
			const inner = radius * (options.innerRadius ?? 0.3);
			const count = Math.max(1, data.length);
			const ring = (radius - inner) / count;
			const thickness = ring * (1 - (options.gap ?? 0.25));
			const seriesOf = seriesResolver(
				colors,
				{ ...options, color: colorAccessor, fixedColor: options.fill },
				id,
				context,
			);
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [index, category] of categories.entries()) {
				const value = values[index];
				if (!isPlaceable(category) || value === undefined) {
					continue;
				}
				const outerRadius = radius - index * ring;
				const shape = {
					cx,
					cy,
					innerRadius: outerRadius - thickness,
					outerRadius,
					startAngle: 0,
					endAngle: max <= 0 ? 0 : (Math.min(value, max) / max) * FULL_TURN,
				};
				const series = seriesOf(index);
				if (options.track !== false) {
					nodes.push({
						kind: "path",
						key: `${id}:track:${categoryKey(category)}`,
						role: "track",
						d: arcPath({ ...shape, endAngle: FULL_TURN }),
						paint: { fill: context.theme.grid, opacity: 0.5 },
					});
				}
				nodes.push({
					kind: "path",
					key: `${id}:${categoryKey(category)}`,
					series: series.key,
					role: "mark",
					d: arcPath(shape),
					paint: paint({ fill: series.color, opacity: options.opacity }),
				});
				if (!tips(options.tip, data[index], index)) {
					continue;
				}
				const anchor = polarToCartesian(
					cx,
					cy,
					outerRadius - thickness / 2,
					Math.max(shape.endAngle, 1),
				);
				points.push({
					key: `${id}:${categoryKey(category)}`,
					markId: id,
					index,
					datum: data[index],
					x: anchor.x,
					y: anchor.y,
					xValue: category,
					yValue: value,
					series: series.key,
					color: series.color,
					title: series.label ?? context.formatX(category),
					value: context.formatY(value),
					hit: { kind: "arc", ...shape, endAngle: FULL_TURN },
				});
			}
			return { nodes, points };
		},
	};
}

export interface RadarOptions<TDatum> extends ChartMarkOptions<TDatum> {
	/** The spoke a value sits on: "Vitesse", "Endurance"… */
	readonly axis: ChartAccessor<TDatum, ChartValue>;
	readonly value: ChartAccessor<TDatum, ChartValue>;
	/** The value the outer ring stands for. Defaults to the largest value, rounded up. */
	readonly max?: number;
	/** Grid rings between the centre and the outer ring. */
	readonly rings?: number;
	readonly fillOpacity?: number;
	readonly fill?: string;
	/** `false` leaves the grid and spoke labels to another radar on the same chart. */
	readonly grid?: boolean;
}

const LABEL_GAP = 8;

function anchorFor(angle: number): {
	readonly textAnchor: "start" | "middle" | "end";
	readonly baseline: "top" | "middle" | "bottom";
} {
	const normalized = ((angle % FULL_TURN) + FULL_TURN) % FULL_TURN;
	const side = Math.sin((normalized * Math.PI) / 180);
	const vertical = -Math.cos((normalized * Math.PI) / 180);
	return {
		textAnchor: Math.abs(side) < 0.2 ? "middle" : side > 0 ? "start" : "end",
		baseline:
			Math.abs(vertical) < 0.2 ? "middle" : vertical > 0 ? "top" : "bottom",
	};
}

function radarGrid(
	id: string,
	context: ChartMarkContext,
	frame: Frame,
	axes: ReadonlyArray<ChartValue>,
	rings: number,
): SceneNode[] {
	const { cx, cy, radius } = frame;
	const { theme } = context;
	const nodes: SceneNode[] = [];
	for (let level = 1; level <= rings; level += 1) {
		const ringRadius = (radius * level) / rings;
		nodes.push({
			kind: "path",
			key: `${id}:ring:${level}`,
			role: "grid",
			d: polygonPath(
				axes.map((_axis, index) =>
					polarToCartesian(
						cx,
						cy,
						ringRadius,
						(FULL_TURN * index) / axes.length,
					),
				),
			),
			paint: { stroke: theme.grid, strokeWidth: 1, fill: "none" },
		});
	}
	for (const [index, axis] of axes.entries()) {
		const angle = (FULL_TURN * index) / axes.length;
		const end = polarToCartesian(cx, cy, radius, angle);
		const label = polarToCartesian(cx, cy, radius + LABEL_GAP, angle);
		nodes.push(
			{
				kind: "line",
				key: `${id}:spoke:${categoryKey(axis)}`,
				role: "grid",
				x1: cx,
				y1: cy,
				x2: end.x,
				y2: end.y,
				paint: { stroke: theme.grid, strokeWidth: 1 },
			},
			{
				kind: "text",
				key: `${id}:axis:${categoryKey(axis)}`,
				role: "axis",
				x: label.x,
				y: label.y,
				text: context.formatX(axis),
				paint: {
					fill: theme.muted,
					fontSize: theme.fontSize,
					...anchorFor(angle),
				},
			},
		);
	}
	return nodes;
}

/** Values on spokes joined into a polygon, one per series: profiles compared at a glance. */
export function radar<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: RadarOptions<TDatum>,
): ChartMark {
	const axisValues = readChannel(data, options.axis);
	const values = readChannel(data, options.value).map(numericValue);
	const colors = readChannel(data, options.color);
	const axes = [
		...new Map(
			axisValues.filter(isPlaceable).map((axis) => [categoryKey(axis), axis]),
		).values(),
	];
	return {
		id: options.id,
		coordinate: "frame",
		titles: {
			category: channelLabel(options.axis),
			value: channelLabel(options.value) ?? options.label,
		},
		channels:
			options.color === undefined
				? {}
				: {
						color: {
							values: colors.filter(isPlaceable),
							label: channelLabel(options.color),
						},
					},
		render(context) {
			const id = markId(options.id, "radar", context);
			const widest = Math.max(
				0,
				...axes.map((axis) =>
					context.measureText(context.formatX(axis), context.theme.fontSize),
				),
			);
			const frame = frameOf(
				context.plot,
				widest + LABEL_GAP,
				context.theme.fontSize + LABEL_GAP,
			);
			const peak = Math.max(0, ...values.map((value) => value ?? 0));
			const max = options.max ?? niceDomain(0, peak)[1];
			const seriesOf = seriesResolver(
				colors,
				{ ...options, fixedColor: options.fill },
				id,
				context,
			);
			const nodes: SceneNode[] =
				options.grid === false
					? []
					: radarGrid(id, context, frame, axes, options.rings ?? 4);
			const points: ChartPoint[] = [];
			const polygons = new Map<
				string,
				{ color: string; vertices: Array<ChartXY | undefined> }
			>();
			for (const [index, axis] of axisValues.entries()) {
				const value = values[index];
				const spoke = isPlaceable(axis)
					? axes.findIndex(
							(candidate) => categoryKey(candidate) === categoryKey(axis),
						)
					: -1;
				if (spoke === -1 || value === undefined || !isPlaceable(axis)) {
					continue;
				}
				const series = seriesOf(index);
				const angle = (FULL_TURN * spoke) / axes.length;
				const vertex = polarToCartesian(
					frame.cx,
					frame.cy,
					max <= 0 ? 0 : (Math.min(value, max) / max) * frame.radius,
					angle,
				);
				const polygon = polygons.get(series.key) ?? {
					color: series.color,
					vertices: axes.map(() => undefined),
				};
				polygon.vertices[spoke] = vertex;
				polygons.set(series.key, polygon);
				if (tips(options.tip, data[index], index)) {
					points.push({
						key: `${id}:${index}`,
						markId: id,
						index,
						datum: data[index],
						x: vertex.x,
						y: vertex.y,
						xValue: axis,
						yValue: value,
						series: series.key,
						seriesLabel: series.label,
						color: series.color,
						title: context.formatX(axis),
						value: context.formatY(value),
					});
				}
			}
			for (const [key, polygon] of polygons) {
				nodes.push({
					kind: "path",
					key: `${id}:shape:${key}`,
					series: key,
					role: "mark",
					d: polygonPath(
						polygon.vertices.map(
							(vertex) => vertex ?? { x: frame.cx, y: frame.cy },
						),
					),
					paint: paint({
						fill: polygon.color,
						fillOpacity: options.fillOpacity ?? 0.2,
						stroke: polygon.color,
						strokeWidth: 2,
						strokeLinejoin: "round",
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
								color: options.fill ?? context.paletteColor(context.markIndex),
								shape: "square" as const,
							},
						]
					: [];
			return { nodes, points, legend };
		},
	};
}
