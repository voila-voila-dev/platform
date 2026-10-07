import {
	channelLabel,
	isPlaceable,
	numericValue,
	readChannel,
} from "#/core/channel.ts";
import { markId, paint } from "#/core/marks/shared.ts";
import {
	boxSummary,
	kernelDensity,
	samples,
	silvermanBandwidth,
} from "#/core/marks/stats/statistics.ts";
import { areaPath, type ChartXY, polygonPath } from "#/core/paths.ts";
import { categoryKey } from "#/core/scales/discrete.ts";
import type {
	ChartAccessor,
	ChartMark,
	ChartPoint,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

/**
 * Distributions per category: the box plot, the violin and the ridgeline.
 * Each groups the values by category first; a category's point (what the
 * keyboard visits) sits on its median.
 */

interface DistributionOptions<TDatum> {
	readonly id?: string;
	readonly label?: string;
	readonly fill?: string;
	readonly opacity?: number;
	readonly tip?: boolean;
	readonly category: ChartAccessor<TDatum, ChartValue>;
	readonly value: ChartAccessor<TDatum, ChartValue>;
}

interface Group {
	readonly category: ChartValue;
	readonly values: number[];
}

function groupValues<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: DistributionOptions<TDatum>,
): ReadonlyArray<Group> {
	const categories = readChannel(data, options.category);
	const values = readChannel(data, options.value).map(numericValue);
	const groups = new Map<string, Group>();
	for (const [index, category] of categories.entries()) {
		const value = values[index];
		if (!isPlaceable(category) || value === undefined) {
			continue;
		}
		const key = categoryKey(category);
		const group = groups.get(key) ?? { category, values: [] };
		group.values.push(value);
		groups.set(key, group);
	}
	return [...groups.values()];
}

function rangeOf(groups: ReadonlyArray<Group>): ReadonlyArray<number> {
	return groups.flatMap((group) =>
		group.values.length === 0
			? []
			: [Math.min(...group.values), Math.max(...group.values)],
	);
}

export interface BoxOptions<TDatum> extends DistributionOptions<TDatum> {
	/** Share of the band the box takes. */
	readonly width?: number;
}

const OUTLIER_RADIUS = 2.5;

/**
 * Box and whiskers per category: the box from the first to the third
 * quartile, the median across it, whiskers to the furthest values within
 * 1.5 IQR, and the outliers past them as dots.
 */
export function boxY<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: BoxOptions<TDatum>,
): ChartMark {
	const groups = groupValues(data, options);
	const summaries = groups.map((group) => ({
		group,
		summary: boxSummary(group.values),
	}));
	return {
		id: options.id,
		coordinate: "cartesian",
		focusOrder: "x",
		channels: {
			x: {
				values: groups.map((group) => group.category),
				discrete: "band",
				label: channelLabel(options.category),
			},
			y: {
				values: rangeOf(groups),
				label: channelLabel(options.value) ?? options.label,
			},
		},
		render(context) {
			const id = markId(options.id, "boxY", context);
			const { x: xScale, y: yScale } = context.scales;
			if (xScale === undefined || yScale === undefined) {
				return { nodes: [] };
			}
			const color = options.fill ?? context.paletteColor(context.markIndex);
			const width = xScale.bandwidth * (options.width ?? 0.6);
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const { group, summary } of summaries) {
				if (summary === undefined) {
					continue;
				}
				const key = categoryKey(group.category);
				const center = xScale.center(group.category);
				const left = center - width / 2;
				const stroke = {
					stroke: color,
					strokeWidth: 1.5,
					opacity: options.opacity,
				};
				const top = yScale.map(summary.q3);
				const bottom = yScale.map(summary.q1);
				nodes.push(
					{
						kind: "line",
						key: `${id}:whisker:${key}`,
						role: "mark",
						x1: center,
						y1: yScale.map(summary.high),
						x2: center,
						y2: yScale.map(summary.low),
						paint: paint(stroke),
					},
					{
						kind: "rect",
						key: `${id}:box:${key}`,
						role: "mark",
						x: left,
						y: Math.min(top, bottom),
						width,
						height: Math.abs(bottom - top),
						corners: [2, 2, 2, 2],
						paint: paint({ ...stroke, fill: color, fillOpacity: 0.25 }),
					},
					{
						kind: "line",
						key: `${id}:median:${key}`,
						role: "mark",
						x1: left,
						y1: yScale.map(summary.median),
						x2: left + width,
						y2: yScale.map(summary.median),
						paint: paint({ ...stroke, strokeWidth: 2.5 }),
					},
					...summary.outliers.map(
						(value, index): SceneNode => ({
							kind: "circle",
							key: `${id}:outlier:${key}:${index}`,
							role: "mark",
							cx: center,
							cy: yScale.map(value),
							r: OUTLIER_RADIUS,
							paint: paint({ fill: "none", ...stroke }),
						}),
					),
				);
				if (options.tip !== false) {
					points.push({
						key: `${id}:${key}`,
						markId: id,
						index: groups.indexOf(group),
						datum: summary,
						x: center,
						y: yScale.map(summary.median),
						xValue: group.category,
						yValue: summary.median,
						seriesLabel: options.label,
						color,
						title: context.formatX(group.category),
						value: `${context.formatY(summary.median)} (${context.formatY(summary.q1)} – ${context.formatY(summary.q3)})`,
						hit: {
							kind: "rect",
							rect: {
								x: left,
								y: Math.min(top, bottom),
								width,
								height: Math.abs(bottom - top),
							},
						},
					});
				}
			}
			return { nodes, points };
		},
	};
}

const DENSITY_SAMPLES = 48;

/**
 * The density of each category's values, mirrored around its centre: the
 * shape a box plot hides (two peaks, a long tail).
 */
export function violinY<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: DistributionOptions<TDatum>,
): ChartMark {
	const groups = groupValues(data, options);
	const shapes = groups.map((group) => {
		const low = Math.min(...group.values);
		const high = Math.max(...group.values);
		const pad = silvermanBandwidth(group.values);
		const at = samples(low - pad, high + pad, DENSITY_SAMPLES);
		return {
			group,
			at,
			density: kernelDensity(group.values, at),
			summary: boxSummary(group.values),
		};
	});
	const peak = Math.max(0, ...shapes.flatMap((shape) => shape.density));
	return {
		id: options.id,
		coordinate: "cartesian",
		focusOrder: "x",
		channels: {
			x: {
				values: groups.map((group) => group.category),
				discrete: "band",
				label: channelLabel(options.category),
			},
			y: {
				values: shapes.flatMap((shape) => [
					shape.at[0],
					shape.at[shape.at.length - 1],
				]),
				label: channelLabel(options.value) ?? options.label,
			},
		},
		render(context) {
			const id = markId(options.id, "violinY", context);
			const { x: xScale, y: yScale } = context.scales;
			if (xScale === undefined || yScale === undefined) {
				return { nodes: [] };
			}
			const color = options.fill ?? context.paletteColor(context.markIndex);
			const half = xScale.bandwidth / 2;
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [index, shape] of shapes.entries()) {
				const center = xScale.center(shape.group.category);
				const width = (value: number) =>
					peak === 0 ? 0 : (value / peak) * half;
				const right: ChartXY[] = shape.at.map((value, sample) => ({
					x: center + width(shape.density[sample]),
					y: yScale.map(value),
				}));
				const left: ChartXY[] = shape.at
					.map((value, sample) => ({
						x: center - width(shape.density[sample]),
						y: yScale.map(value),
					}))
					.reverse();
				const key = categoryKey(shape.group.category);
				nodes.push({
					kind: "path",
					key: `${id}:${key}`,
					role: "mark",
					d: polygonPath([...right, ...left]),
					paint: paint({
						fill: color,
						fillOpacity: 0.3,
						stroke: color,
						strokeWidth: 1.5,
						opacity: options.opacity,
					}),
				});
				const summary = shape.summary;
				if (summary === undefined) {
					continue;
				}
				nodes.push({
					kind: "line",
					key: `${id}:median:${key}`,
					role: "mark",
					x1: center - half * 0.25,
					y1: yScale.map(summary.median),
					x2: center + half * 0.25,
					y2: yScale.map(summary.median),
					paint: { stroke: color, strokeWidth: 2.5 },
				});
				if (options.tip !== false) {
					points.push({
						key: `${id}:${key}`,
						markId: id,
						index,
						datum: summary,
						x: center,
						y: yScale.map(summary.median),
						xValue: shape.group.category,
						yValue: summary.median,
						seriesLabel: options.label,
						color,
						title: context.formatX(shape.group.category),
						value: `${context.formatY(summary.median)} (${context.formatY(summary.q1)} – ${context.formatY(summary.q3)})`,
					});
				}
			}
			return { nodes, points };
		},
	};
}

const DEFAULT_OVERLAP = 1.6;

export interface RidgelineOptions<TDatum> extends DistributionOptions<TDatum> {
	/** How far each ridge may rise into the row above: 1 stays in its row. */
	readonly overlap?: number;
}

/**
 * One density per row, stacked down the chart and allowed to overlap the row
 * above: many distributions compared along one shared x axis.
 */
export function ridgeline<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: RidgelineOptions<TDatum>,
): ChartMark {
	const overlap = options.overlap ?? DEFAULT_OVERLAP;
	const groups = groupValues(data, options);
	const all = groups.flatMap((group) => group.values);
	const low = Math.min(...all);
	const high = Math.max(...all);
	const pad = silvermanBandwidth(all);
	const at = samples(low - pad, high + pad, DENSITY_SAMPLES * 2);
	const shapes = groups.map((group) => ({
		group,
		density: kernelDensity(group.values, at, silvermanBandwidth(group.values)),
	}));
	const peak = Math.max(0, ...shapes.flatMap((shape) => shape.density));
	return {
		id: options.id,
		coordinate: "cartesian",
		focusOrder: "y",
		channels: {
			x: {
				values: all.length === 0 ? [] : [at[0], at[at.length - 1]],
				label: channelLabel(options.value) ?? options.label,
			},
			y: {
				values: groups.map((group) => group.category),
				discrete: "band",
				padding: 0,
				// Room above the first row for its ridge to rise into.
				paddingOuter: Math.max(0, overlap - 1),
				label: channelLabel(options.category),
			},
		},
		render(context) {
			const id = markId(options.id, "ridgeline", context);
			const { x: xScale, y: yScale } = context.scales;
			if (xScale === undefined || yScale === undefined) {
				return { nodes: [] };
			}
			const rise = yScale.bandwidth * overlap;
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [index, shape] of shapes.entries()) {
				const color = options.fill ?? context.paletteColor(index);
				const baseline = yScale.map(shape.group.category) + yScale.bandwidth;
				const top = at.map((value, sample) => ({
					x: xScale.map(value),
					y:
						baseline - (peak === 0 ? 0 : (shape.density[sample] / peak) * rise),
				}));
				const bottom = at.map((value) => ({
					x: xScale.map(value),
					y: baseline,
				}));
				const key = categoryKey(shape.group.category);
				nodes.push({
					kind: "path",
					key: `${id}:${key}`,
					role: "mark",
					d: areaPath(top, bottom, "monotone"),
					paint: paint({
						fill: color,
						fillOpacity: 0.75,
						stroke: context.theme.background,
						strokeWidth: 1,
						opacity: options.opacity,
					}),
				});
				const summary = boxSummary(shape.group.values);
				if (options.tip !== false && summary !== undefined) {
					points.push({
						key: `${id}:${key}`,
						markId: id,
						index,
						datum: summary,
						x: xScale.map(summary.median),
						y: baseline - yScale.bandwidth / 2,
						xValue: summary.median,
						yValue: shape.group.category,
						seriesLabel: options.label,
						color,
						title: context.formatY(shape.group.category),
						value: `${context.formatX(summary.median)} (${context.formatX(summary.q1)} – ${context.formatX(summary.q3)})`,
					});
				}
			}
			return { nodes, points };
		},
	};
}
