import { isPlaceable, numericValue, readChannel } from "#/core/channel.ts";
import { markId, paint } from "#/core/marks/shared.ts";
import { linearFit } from "#/core/marks/stats/statistics.ts";
import { areaPath, linePath } from "#/core/paths.ts";
import { toNumber } from "#/core/scales/continuous.ts";
import type {
	ChartAccessor,
	ChartMark,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface RegressionOptions<TDatum> {
	readonly id?: string;
	readonly x: ChartAccessor<TDatum, ChartValue>;
	readonly y: ChartAccessor<TDatum, ChartValue>;
	readonly stroke?: string;
	/** Shade the 95 % confidence band of the fitted mean. */
	readonly band?: boolean;
	readonly label?: string;
}

const BAND_SAMPLES = 24;

/** The least-squares line through x and y, and how sure it is. Drawn over a scatter. */
export function regressionY<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: RegressionOptions<TDatum>,
): ChartMark {
	const pairs = readChannel(data, options.x)
		.map((x, index) => ({
			x,
			y: numericValue(readChannel(data, options.y)[index]),
		}))
		.filter(
			(pair): pair is { x: ChartValue; y: number } =>
				isPlaceable(pair.x) && pair.y !== undefined,
		);
	const xs = pairs.map((pair) => toNumber(pair.x));
	const fit = linearFit(
		xs,
		pairs.map((pair) => pair.y),
	);
	const dates = pairs.some((pair) => pair.x instanceof Date);
	return {
		id: options.id,
		coordinate: "cartesian",
		channels: {
			x: { values: pairs.map((pair) => pair.x) },
			y: { values: pairs.map((pair) => pair.y) },
		},
		render(context) {
			const id = markId(options.id, "regressionY", context);
			const { x: xScale, y: yScale } = context.scales;
			if (
				fit === undefined ||
				xScale === undefined ||
				yScale === undefined ||
				xs.length === 0
			) {
				return { nodes: [] };
			}
			const low = Math.min(...xs);
			const high = Math.max(...xs);
			const at = Array.from(
				{ length: BAND_SAMPLES },
				(_unused, index) => low + ((high - low) * index) / (BAND_SAMPLES - 1),
			);
			const place = (x: number) => xScale.map(dates ? new Date(x) : x);
			const stroke = options.stroke ?? context.theme.foreground;
			const nodes: SceneNode[] = [];
			if (options.band !== false) {
				nodes.push({
					kind: "path",
					key: `${id}:band`,
					role: "mark",
					d: areaPath(
						at.map((x) => ({
							x: place(x),
							y: yScale.map(fit.intercept + fit.slope * x + fit.margin(x)),
						})),
						at.map((x) => ({
							x: place(x),
							y: yScale.map(fit.intercept + fit.slope * x - fit.margin(x)),
						})),
					),
					paint: { fill: stroke, fillOpacity: 0.12 },
				});
			}
			nodes.push({
				kind: "path",
				key: `${id}:line`,
				role: "mark",
				d: linePath([
					{ x: place(low), y: yScale.map(fit.intercept + fit.slope * low) },
					{ x: place(high), y: yScale.map(fit.intercept + fit.slope * high) },
				]),
				paint: paint({ fill: "none", stroke, strokeWidth: 2 }),
			});
			return {
				nodes,
				legend: options.label
					? [{ key: id, label: options.label, color: stroke, shape: "line" }]
					: [],
			};
		},
	};
}
