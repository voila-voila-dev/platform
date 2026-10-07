import { channelLabel, isPlaceable, readChannel } from "#/core/channel.ts";
import { markId, valueOn } from "#/core/marks/shared.ts";
import { polygonPath } from "#/core/paths.ts";
import type {
	ChartAccessor,
	ChartMark,
	ChartPoint,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface HexbinOptions<TDatum> {
	readonly id?: string;
	readonly x: ChartAccessor<TDatum, ChartValue>;
	readonly y: ChartAccessor<TDatum, ChartValue>;
	/** Pixel radius of a hexagon. */
	readonly radius?: number;
	/** Colour of the fullest bin; emptier bins fade towards the background. */
	readonly fill?: string;
	readonly label?: string;
}

const DEFAULT_RADIUS = 10;
const SQRT3 = Math.sqrt(3);

/**
 * The centre of the hexagon a pixel falls in, on a pointy-top grid whose odd
 * rows are offset by half a hexagon. Near a slanted edge the nearest row is
 * not always the right one, so the closer of the two candidate centres wins.
 */
export function hexCenter(
	x: number,
	y: number,
	radius: number,
): { x: number; y: number } {
	const dx = radius * SQRT3;
	const dy = radius * 1.5;
	const row = Math.round(y / dy);
	const neighbourRow = y / dy > row ? row + 1 : row - 1;
	const centres = [row, neighbourRow].map((candidate) => {
		const shift = (candidate & 1) / 2;
		return { x: (Math.round(x / dx - shift) + shift) * dx, y: candidate * dy };
	});
	return Math.hypot(centres[0].x - x, centres[0].y - y) <=
		Math.hypot(centres[1].x - x, centres[1].y - y)
		? centres[0]
		: centres[1];
}

function hexagon(cx: number, cy: number, radius: number) {
	return Array.from({ length: 6 }, (_unused, index) => {
		const angle = (Math.PI / 3) * index + Math.PI / 6;
		return {
			x: cx + radius * Math.cos(angle),
			y: cy + radius * Math.sin(angle),
		};
	});
}

/**
 * Points counted into hexagons: a scatter too dense to read as dots. The
 * bins are found in pixels, so they stay hexagonal whatever the scales.
 */
export function hexbin<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: HexbinOptions<TDatum>,
): ChartMark {
	const xs = readChannel(data, options.x);
	const ys = readChannel(data, options.y);
	const reach = options.radius ?? DEFAULT_RADIUS;
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
				label: channelLabel(options.y),
				inset: reach,
			},
		},
		render(context) {
			const id = markId(options.id, "hexbin", context);
			const { x: xScale, y: yScale } = context.scales;
			if (xScale === undefined || yScale === undefined) {
				return { nodes: [] };
			}
			const radius = options.radius ?? DEFAULT_RADIUS;
			const bins = new Map<
				string,
				{ x: number; y: number; members: number[] }
			>();
			for (const [index, raw] of xs.entries()) {
				const x = valueOn(xScale, raw);
				const y = valueOn(yScale, ys[index]);
				if (x === undefined || y === undefined) continue;
				const center = hexCenter(xScale.center(x), yScale.center(y), radius);
				const key = `${Math.round(center.x)}:${Math.round(center.y)}`;
				const bin = bins.get(key) ?? { ...center, members: [] };
				bin.members.push(index);
				bins.set(key, bin);
			}
			const fullest = Math.max(
				1,
				...[...bins.values()].map((bin) => bin.members.length),
			);
			const color = options.fill ?? context.paletteColor(context.markIndex);
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [key, bin] of bins) {
				const share = bin.members.length / fullest;
				const fill = `color-mix(in oklab, ${color} ${Math.round(15 + 85 * share)}%, ${context.theme.background})`;
				nodes.push({
					kind: "path",
					key: `${id}:${key}`,
					role: "mark",
					d: polygonPath(hexagon(bin.x, bin.y, radius - 0.5)),
					paint: { fill },
				});
				points.push({
					key: `${id}:${key}`,
					markId: id,
					index: bin.members[0],
					datum: bin.members.map((index) => data[index]),
					x: bin.x,
					y: bin.y,
					xValue: xScale.invert(bin.x),
					yValue: yScale.invert(bin.y),
					seriesLabel: options.label,
					color: fill,
					title: `${context.formatX(xScale.invert(bin.x))} · ${context.formatY(yScale.invert(bin.y))}`,
					value: String(bin.members.length),
					hit: {
						kind: "rect",
						rect: {
							x: bin.x - radius,
							y: bin.y - radius,
							width: radius * 2,
							height: radius * 2,
						},
					},
				});
			}
			return { nodes, points };
		},
	};
}
