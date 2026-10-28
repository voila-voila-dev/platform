import {
	channelLabel,
	isPlaceable,
	numericValue,
	readChannel,
} from "#/core/channel.ts";
import { formatPercentage } from "#/core/format.ts";
import { funnelSlices } from "#/core/marks/funnel-layout.ts";
import {
	type ChartMarkOptions,
	markId,
	paint,
	seriesResolver,
	tips,
} from "#/core/marks/shared.ts";
import { categoryKey } from "#/core/scales/discrete.ts";
import type {
	ChartAccessor,
	ChartMark,
	ChartPoint,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface FunnelOptions<TDatum> extends ChartMarkOptions<TDatum> {
	/** The step: "Visites", "Inscriptions", "Missions". */
	readonly category: ChartAccessor<TDatum, ChartValue>;
	readonly value: ChartAccessor<TDatum, ChartValue>;
	/** Pixels of blank between two steps. */
	readonly gap?: number;
	readonly fill?: string;
	/** `false` drops the step name and value written above each step. */
	readonly labels?: boolean;
}

/** Room kept above the shape for each step's name and value. */
const LABEL_ZONE = 36;

/**
 * Steps left to right, each as tall as its value, each sloping down to the
 * next: the drop between two stages is the shape itself. The tooltip gives
 * the conversion from the step before.
 */
export function funnel<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: FunnelOptions<TDatum>,
): ChartMark {
	const categories = readChannel(data, options.category);
	const values = readChannel(data, options.value).map(
		(value) => numericValue(value) ?? 0,
	);
	const colorAccessor = options.color ?? options.category;
	const colors = readChannel(data, colorAccessor);
	return {
		id: options.id,
		coordinate: "frame",
		focusOrder: "point",
		colorLegend: options.labels === false,
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
			const id = markId(options.id, "funnel", context);
			const { plot, theme } = context;
			const labelled = options.labels !== false;
			const top = plot.y + (labelled ? LABEL_ZONE : 0);
			const height = Math.max(0, plot.height - (labelled ? LABEL_ZONE : 0));
			const slices = funnelSlices({
				values,
				innerWidth: plot.width,
				innerHeight: height,
				centerY: top + height / 2,
				originX: plot.x,
				gap: options.gap,
			});
			const seriesOf = seriesResolver(
				colors,
				{ ...options, color: colorAccessor, fixedColor: options.fill },
				id,
				context,
			);
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const slice of slices) {
				const category = categories[slice.index];
				if (!isPlaceable(category) || slice.path === "") {
					continue;
				}
				const series = seriesOf(slice.index);
				const key = categoryKey(category);
				nodes.push({
					kind: "path",
					key: `${id}:${key}`,
					series: series.key,
					role: "mark",
					d: slice.path,
					paint: paint({ fill: series.color, opacity: options.opacity }),
				});
				if (labelled) {
					nodes.push(
						{
							kind: "text",
							key: `${id}:name:${key}`,
							role: "label",
							x: slice.x,
							y: plot.y,
							text: series.label ?? context.formatX(category),
							paint: {
								fill: theme.muted,
								fontSize: theme.fontSize,
								baseline: "top",
							},
						},
						{
							kind: "text",
							key: `${id}:value:${key}`,
							role: "label",
							x: slice.x,
							y: plot.y + theme.fontSize + 4,
							text: context.formatY(slice.value),
							paint: {
								fill: theme.foreground,
								fontSize: theme.fontSize + 2,
								fontWeight: 600,
								baseline: "top",
							},
						},
					);
				}
				if (!tips(options.tip, data[slice.index], slice.index)) {
					continue;
				}
				const previous = slice.index > 0 ? values[slice.index - 1] : undefined;
				const conversion =
					previous !== undefined && previous > 0
						? ` (${formatPercentage(slice.value / previous, context.locale)})`
						: "";
				const centerY = top + height / 2;
				points.push({
					key: `${id}:${key}`,
					markId: id,
					index: slice.index,
					datum: data[slice.index],
					x: slice.x + slice.width / 2,
					y: centerY,
					xValue: category,
					yValue: slice.value,
					series: series.key,
					color: series.color,
					title: series.label ?? context.formatX(category),
					value: `${context.formatY(slice.value)}${conversion}`,
					hit: {
						kind: "rect",
						rect: {
							x: slice.x,
							y: centerY - slice.leftHeight / 2,
							width: slice.width,
							height: slice.leftHeight,
						},
					},
				});
			}
			return { nodes, points };
		},
	};
}
