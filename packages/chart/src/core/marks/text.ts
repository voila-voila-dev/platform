import { channelLabel, isPlaceable, readChannel } from "#/core/channel.ts";
import { markId, paint, valueOn } from "#/core/marks/shared.ts";
import type {
	ChartAccessor,
	ChartMark,
	ChartTextPaint,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface TextOptions<TDatum> {
	readonly id?: string;
	readonly x?: ChartAccessor<TDatum, ChartValue>;
	readonly y?: ChartAccessor<TDatum, ChartValue>;
	readonly text: ChartAccessor<TDatum, unknown>;
	/** Pixel offsets from the anchor. */
	readonly dx?: number;
	readonly dy?: number;
	readonly fill?: string;
	readonly fontSize?: number;
	readonly fontWeight?: number;
	readonly textAnchor?: ChartTextPaint["textAnchor"];
	readonly baseline?: ChartTextPaint["baseline"];
	readonly opacity?: number;
}

/** A label per datum: values on bars, names on points, annotations. */
export function text<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: TextOptions<TDatum>,
): ChartMark {
	const xs = readChannel(data, options.x);
	const ys = readChannel(data, options.y);
	const texts = readChannel(data, options.text);
	return {
		id: options.id,
		coordinate: "cartesian",
		channels: {
			...(options.x === undefined
				? {}
				: {
						x: {
							values: xs.filter(isPlaceable),
							label: channelLabel(options.x),
						},
					}),
			...(options.y === undefined
				? {}
				: {
						y: {
							values: ys.filter(isPlaceable),
							label: channelLabel(options.y),
						},
					}),
		},
		render(context) {
			const id = markId(options.id, "text", context);
			const { scales, plot, theme } = context;
			const nodes: SceneNode[] = [];
			for (const [index, content] of texts.entries()) {
				const xValue = scales.x && valueOn(scales.x, xs[index]);
				const yValue = scales.y && valueOn(scales.y, ys[index]);
				const x =
					scales.x && xValue !== undefined
						? scales.x.center(xValue)
						: plot.x + plot.width / 2;
				const y =
					scales.y && yValue !== undefined
						? scales.y.center(yValue)
						: plot.y + plot.height / 2;
				if (content === undefined || content === null || content === "") {
					continue;
				}
				nodes.push({
					kind: "text",
					key: `${id}:${index}`,
					role: "label",
					x: x + (options.dx ?? 0),
					y: y + (options.dy ?? 0),
					text:
						typeof content === "number"
							? context.formatY(content)
							: String(content),
					paint: paint({
						fill: options.fill ?? theme.foreground,
						opacity: options.opacity,
						fontSize: options.fontSize ?? theme.fontSize,
						fontWeight: options.fontWeight,
						textAnchor: options.textAnchor ?? "middle",
						baseline: options.baseline ?? "middle",
					}),
				});
			}
			return { nodes };
		},
	};
}
