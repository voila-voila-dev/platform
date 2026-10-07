import { Delaunay } from "d3-delaunay";
import { isPlaceable, readChannel } from "#/core/channel.ts";
import { markId, valueOn } from "#/core/marks/shared.ts";
import type {
	ChartAccessor,
	ChartMark,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface VoronoiOptions<TDatum> {
	readonly id?: string;
	readonly x: ChartAccessor<TDatum, ChartValue>;
	readonly y: ChartAccessor<TDatum, ChartValue>;
	readonly stroke?: string;
	/** Fill each cell, by its own colour, instead of drawing the borders only. */
	readonly fill?: (datum: TDatum, index: number) => string;
}

/**
 * Each point's cell: the area closer to it than to any other. Clipped to the
 * plot. The borders alone read as a mesh over a scatter; filled, the cells
 * become territories.
 */
export function voronoi<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: VoronoiOptions<TDatum>,
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
			const id = markId(options.id, "voronoi", context);
			const { x: xScale, y: yScale } = context.scales;
			if (xScale === undefined || yScale === undefined) {
				return { nodes: [] };
			}
			const { plot } = context;
			const indices: number[] = [];
			const pixels: Array<[number, number]> = [];
			for (const [index, raw] of xs.entries()) {
				const x = valueOn(xScale, raw);
				const y = valueOn(yScale, ys[index]);
				if (x !== undefined && y !== undefined) {
					indices.push(index);
					pixels.push([xScale.center(x), yScale.center(y)]);
				}
			}
			if (pixels.length === 0) {
				return { nodes: [] };
			}
			const diagram = Delaunay.from(pixels).voronoi([
				plot.x,
				plot.y,
				plot.x + plot.width,
				plot.y + plot.height,
			]);
			const nodes: SceneNode[] = indices.map((dataIndex, cell) => ({
				kind: "path",
				key: `${id}:${dataIndex}`,
				role: "mark",
				d: diagram.renderCell(cell) ?? "",
				paint: options.fill
					? {
							fill: options.fill(data[dataIndex], dataIndex),
							stroke: context.theme.background,
							strokeWidth: 1,
						}
					: {
							fill: "none",
							stroke: options.stroke ?? context.theme.grid,
							strokeWidth: 1,
						},
			}));
			return { nodes };
		},
	};
}
