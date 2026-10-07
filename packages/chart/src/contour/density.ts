import { mixPath } from "@voila.dev/motion";
import { contourDensity } from "d3-contour";
import { isPlaceable, readChannel } from "#/core/channel.ts";
import { markId, valueOn } from "#/core/marks/shared.ts";
import { multiPolygonPath } from "#/core/paths.ts";
import type {
	ChartAccessor,
	ChartMark,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface Density2dOptions<TDatum> {
	readonly id?: string;
	readonly x: ChartAccessor<TDatum, ChartValue>;
	readonly y: ChartAccessor<TDatum, ChartValue>;
	/** Smoothing, in pixels. */
	readonly bandwidth?: number;
	/** How many density levels to draw. */
	readonly thresholds?: number;
	readonly fill?: string;
	/** Outline the levels instead of filling them. */
	readonly stroke?: boolean;
}

/**
 * Where points crowd, as nested contours: the shape of a scatter too dense
 * to read. Decorative on its own (the levels are not values a reader can
 * visit), so draw the points too, or give the chart a description.
 */
export function density2d<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: Density2dOptions<TDatum>,
): ChartMark {
	const xs = readChannel(data, options.x);
	const ys = readChannel(data, options.y);
	return {
		id: options.id,
		coordinate: "cartesian",
		channels: {
			x: { values: xs.filter(isPlaceable) },
			y: { values: ys.filter(isPlaceable) },
		},
		render(context) {
			const id = markId(options.id, "density2d", context);
			const { x: xScale, y: yScale } = context.scales;
			if (xScale === undefined || yScale === undefined) {
				return { nodes: [] };
			}
			const { plot } = context;
			const pixels: Array<[number, number]> = [];
			for (const [index, raw] of xs.entries()) {
				const x = valueOn(xScale, raw);
				const y = valueOn(yScale, ys[index]);
				if (x !== undefined && y !== undefined) {
					pixels.push([xScale.center(x) - plot.x, yScale.center(y) - plot.y]);
				}
			}
			const levels = contourDensity()
				.x((pixel) => pixel[0])
				.y((pixel) => pixel[1])
				.size([
					Math.max(1, Math.round(plot.width)),
					Math.max(1, Math.round(plot.height)),
				])
				.bandwidth(options.bandwidth ?? 20)
				.thresholds(options.thresholds ?? 8)(pixels);
			const color = options.fill ?? context.paletteColor(context.markIndex);
			const nodes: SceneNode[] = levels.map((level, index) => {
				const share = levels.length <= 1 ? 1 : (index + 1) / levels.length;
				return {
					kind: "path",
					key: `${id}:${index}`,
					role: "mark",
					d: multiPolygonPath(level.coordinates as never, plot.x, plot.y),
					morph: mixPath,
					paint: options.stroke
						? {
								fill: "none",
								stroke: color,
								strokeWidth: 1,
								strokeOpacity: 0.3 + 0.7 * share,
							}
						: { fill: color, fillOpacity: 0.12 },
				};
			});
			return {
				nodes: nodes.filter((node) => node.kind !== "path" || node.d !== ""),
			};
		},
	};
}
