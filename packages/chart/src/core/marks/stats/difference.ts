import {
	channelLabel,
	isPlaceable,
	numericValue,
	readChannel,
} from "#/core/channel.ts";
import { markId, paint, valueOn } from "#/core/marks/shared.ts";
import { POINTS_MOTION, pointsPath } from "#/core/motion/points-motion.ts";
import { areaPath, type ChartXY } from "#/core/paths.ts";
import { categoryKey } from "#/core/scales/discrete.ts";
import type {
	ChartAccessor,
	ChartMark,
	ChartPoint,
	ChartValue,
	GeometryMotion,
	SceneGeometry,
	SceneNode,
} from "#/core/types.ts";

export interface DifferenceOptions<TDatum> {
	readonly id?: string;
	readonly x: ChartAccessor<TDatum, ChartValue>;
	/** The series read against the other: the fill says when it is above. */
	readonly y1: ChartAccessor<TDatum, ChartValue>;
	readonly y2: ChartAccessor<TDatum, ChartValue>;
	/** Names of the two series, for the tooltip, the table and the legend. */
	readonly labels?: readonly [string, string];
	/** Fill where `y1` is above `y2`, and below. */
	readonly positiveFill?: string;
	readonly negativeFill?: string;
	readonly fillOpacity?: number;
}

interface Sample {
	readonly x: number;
	readonly top: number;
	readonly bottom: number;
}

/** One of the two lines, keyed by x so an update slides it like any line. */
function keyedLine(
	samples: readonly (Sample & { readonly key: string })[],
	edge: "top" | "bottom",
): { d: string; geometry: SceneGeometry; motion: GeometryMotion } {
	const geometry: SceneGeometry = {
		kind: "points",
		shape: "line",
		runs: [
			samples.map((sample) => ({
				key: sample.key,
				x: sample.x,
				y: sample[edge],
			})),
		],
	};
	return { d: pointsPath(geometry), geometry, motion: POINTS_MOTION };
}

/** Splits the band between two lines into runs of one sign, cut where they cross. */
function signRuns(
	samples: ReadonlyArray<Sample>,
): Array<{ positive: boolean; samples: Sample[] }> {
	const runs: Array<{ positive: boolean; samples: Sample[] }> = [];
	for (const [index, sample] of samples.entries()) {
		// Pixels: a smaller y is higher, so y1 above y2 means top < bottom.
		const positive = sample.top <= sample.bottom;
		const current = runs[runs.length - 1];
		if (current === undefined) {
			runs.push({ positive, samples: [sample] });
			continue;
		}
		if (current.positive === positive) {
			current.samples.push(sample);
			continue;
		}
		const previous = samples[index - 1];
		const before = previous.top - previous.bottom;
		const after = sample.top - sample.bottom;
		const share = before / (before - after);
		const crossX = previous.x + (sample.x - previous.x) * share;
		const crossY = previous.top + (sample.top - previous.top) * share;
		const cross = { x: crossX, top: crossY, bottom: crossY };
		current.samples.push(cross);
		runs.push({ positive, samples: [cross, sample] });
	}
	return runs;
}

/**
 * Two series and the band between them, filled by which one is ahead:
 * revenue against costs, this year against last.
 */
export function differenceY<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: DifferenceOptions<TDatum>,
): ChartMark {
	const xs = readChannel(data, options.x);
	const first = readChannel(data, options.y1).map(numericValue);
	const second = readChannel(data, options.y2).map(numericValue);
	const [firstLabel, secondLabel] = options.labels ?? [
		channelLabel(options.y1) ?? "y1",
		channelLabel(options.y2) ?? "y2",
	];
	return {
		id: options.id,
		coordinate: "cartesian",
		focusOrder: "x",
		channels: {
			x: { values: xs.filter(isPlaceable), label: channelLabel(options.x) },
			y: {
				values: [...first, ...second].filter(
					(value): value is number => value !== undefined,
				),
			},
		},
		render(context) {
			const id = markId(options.id, "differenceY", context);
			const { x: xScale, y: yScale } = context.scales;
			if (xScale === undefined || yScale === undefined) {
				return { nodes: [] };
			}
			const positive = options.positiveFill ?? context.paletteColor(1);
			const negative = options.negativeFill ?? context.paletteColor(0);
			const samples: Array<Sample & { readonly key: string }> = [];
			const points: ChartPoint[] = [];
			for (const [index, raw] of xs.entries()) {
				const x = valueOn(xScale, raw);
				const a = first[index];
				const b = second[index];
				if (x === undefined || a === undefined || b === undefined) continue;
				const sample = {
					key: categoryKey(x),
					x: xScale.center(x),
					top: yScale.map(a),
					bottom: yScale.map(b),
				};
				samples.push(sample);
				for (const [series, value, pixel, label] of [
					["y1", a, sample.top, firstLabel],
					["y2", b, sample.bottom, secondLabel],
				] as const) {
					points.push({
						key: `${id}:${series}:${index}`,
						markId: id,
						index,
						datum: data[index],
						x: sample.x,
						y: pixel,
						xValue: x,
						yValue: value,
						series: `${id}:${series}`,
						seriesLabel: label,
						color:
							series === "y1" ? context.theme.foreground : context.theme.muted,
						title: context.formatX(x),
						value: context.formatY(value),
					});
				}
			}
			const nodes: SceneNode[] = signRuns(samples).map((run, index) => ({
				kind: "path",
				key: `${id}:band:${index}`,
				role: "mark",
				d: areaPath(
					run.samples.map(
						(sample): ChartXY => ({ x: sample.x, y: sample.top }),
					),
					run.samples.map(
						(sample): ChartXY => ({ x: sample.x, y: sample.bottom }),
					),
				),
				paint: paint({
					fill: run.positive ? positive : negative,
					fillOpacity: options.fillOpacity ?? 0.35,
				}),
			}));
			nodes.push(
				{
					kind: "path",
					key: `${id}:line:y1`,
					series: `${id}:y1`,
					role: "mark",
					...keyedLine(samples, "top"),
					paint: {
						fill: "none",
						stroke: context.theme.foreground,
						strokeWidth: 1.5,
					},
				},
				{
					kind: "path",
					key: `${id}:line:y2`,
					series: `${id}:y2`,
					role: "mark",
					...keyedLine(samples, "bottom"),
					paint: {
						fill: "none",
						stroke: context.theme.muted,
						strokeWidth: 1.5,
						strokeDasharray: "4 3",
					},
				},
			);
			return {
				nodes,
				points,
				legend: [
					{
						key: `${id}:y1`,
						label: firstLabel,
						color: context.theme.foreground,
						shape: "line",
					},
					{
						key: `${id}:y2`,
						label: secondLabel,
						color: context.theme.muted,
						shape: "dashed",
					},
				],
			};
		},
	};
}
