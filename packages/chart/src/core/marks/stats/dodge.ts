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
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface DodgeOptions<TDatum> extends ChartMarkOptions<TDatum> {
	readonly x: ChartAccessor<TDatum, ChartValue>;
	readonly r?: number;
	readonly fill?: string;
	/** Grow from the middle of the plot, or up from its bottom. */
	readonly anchor?: "middle" | "bottom";
}

const DEFAULT_RADIUS = 4;
const SPACING = 1;

/**
 * A beeswarm: one dot per datum along x, nudged up or down just enough not
 * to overlap, so a crowd of values shows its shape and every value stays
 * visible and focusable.
 */
export function dodgeY<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: DodgeOptions<TDatum>,
): ChartMark {
	const xs = readChannel(data, options.x);
	const colors = colorChannel(data, options);
	const r = options.r ?? DEFAULT_RADIUS;
	return {
		id: options.id,
		coordinate: "cartesian",
		focusOrder: "point",
		channels: {
			x: {
				values: xs.filter(isPlaceable),
				label: channelLabel(options.x) ?? options.label,
				inset: r,
			},
			color: colors.channel,
		},
		render(context) {
			const id = markId(options.id, "dodgeY", context);
			const xScale = context.scales.x;
			if (xScale === undefined) {
				return { nodes: [] };
			}
			const { plot } = context;
			const seriesOf = seriesResolver(
				colors.values,
				{ ...options, fixedColor: options.fill },
				id,
				context,
			);
			const order = xs
				.map((raw, index) => ({ index, value: valueOn(xScale, raw) }))
				.filter(
					(entry): entry is { index: number; value: ChartValue } =>
						entry.value !== undefined,
				)
				.map((entry) => ({ ...entry, x: xScale.center(entry.value) }))
				.sort((left, right) => left.x - right.x);
			const placed: Array<{ x: number; y: number }> = [];
			const diameter = r * 2 + SPACING;
			const bottom = options.anchor === "bottom";
			const baseline = bottom
				? plot.y + plot.height - r
				: plot.y + plot.height / 2;
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const entry of order) {
				const near = placed.filter(
					(other) => Math.abs(other.x - entry.x) < diameter,
				);
				let offset = 0;
				// Try 0, +1, −1, +2, −2 half-diameters (only upwards from a bottom anchor).
				for (let step = 0; ; step += 1) {
					const magnitude = Math.ceil(step / (bottom ? 1 : 2)) * (diameter / 2);
					offset = bottom || step % 2 === 1 ? -magnitude : magnitude;
					const y = baseline + offset;
					if (
						near.every(
							(other) => Math.hypot(other.x - entry.x, other.y - y) >= diameter,
						)
					)
						break;
				}
				const y = baseline + offset;
				placed.push({ x: entry.x, y });
				const series = seriesOf(entry.index);
				nodes.push({
					kind: "circle",
					key: `${id}:${entry.index}`,
					series: series.key,
					role: "mark",
					cx: entry.x,
					cy: y,
					r,
					paint: paint({ fill: series.color, opacity: options.opacity }),
				});
				if (tips(options.tip, data[entry.index], entry.index)) {
					points.push({
						key: `${id}:${entry.index}`,
						markId: id,
						index: entry.index,
						datum: data[entry.index],
						x: entry.x,
						y,
						xValue: entry.value,
						series: series.key,
						seriesLabel: series.label,
						color: series.color,
						title: series.label ?? context.formatX(entry.value),
						value: context.formatX(entry.value),
						hit: {
							kind: "rect",
							rect: { x: entry.x - r, y: y - r, width: r * 2, height: r * 2 },
						},
					});
				}
			}
			return { nodes, points };
		},
	};
}
