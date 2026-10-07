import {
	channelLabel,
	isPlaceable,
	numericValue,
	readChannel,
} from "#/core/channel.ts";
import {
	type ChartMarkOptions,
	colorChannel,
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

export interface WaffleOptions<TDatum> extends ChartMarkOptions<TDatum> {
	readonly x: ChartAccessor<TDatum, ChartValue>;
	readonly y: ChartAccessor<TDatum, ChartValue>;
	/** What one cell stands for. */
	readonly unit?: number;
	/** Cells across a band. */
	readonly columns?: number;
	readonly fill?: string;
}

const DEFAULT_COLUMNS = 10;
const CELL_GAP = 1.5;

/**
 * Bars made of countable cells: "12 missions" reads as twelve squares. A
 * row of `columns` cells is `columns × unit` on the y axis, so the waffle
 * still reads against it; series continue one another inside a column.
 */
export function waffleY<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: WaffleOptions<TDatum>,
): ChartMark {
	const xs = readChannel(data, options.x);
	const values = readChannel(data, options.y).map(numericValue);
	const colors = colorChannel(data, options);
	const unit = options.unit ?? 1;
	const columns = options.columns ?? DEFAULT_COLUMNS;
	const totals = new Map<string, number>();
	const offsets = xs.map((x, index) => {
		if (!isPlaceable(x)) return 0;
		const key = categoryKey(x);
		const before = totals.get(key) ?? 0;
		totals.set(
			key,
			before + Math.max(0, Math.round((values[index] ?? 0) / unit)),
		);
		return before;
	});
	const tallest = Math.max(0, ...totals.values());
	return {
		id: options.id,
		coordinate: "cartesian",
		focusOrder: "x",
		channels: {
			x: {
				values: xs.filter(isPlaceable),
				discrete: "band",
				label: channelLabel(options.x),
			},
			y: {
				values: [0, Math.ceil(tallest / columns) * columns * unit],
				includeZero: true,
				label: channelLabel(options.y) ?? options.label,
			},
			color: colors.channel,
		},
		render(context) {
			const id = markId(options.id, "waffleY", context);
			const { x: xScale, y: yScale } = context.scales;
			if (xScale === undefined || yScale === undefined) {
				return { nodes: [] };
			}
			const seriesOf = seriesResolver(
				colors.values,
				{ ...options, fixedColor: options.fill },
				id,
				context,
			);
			const cellWidth = xScale.bandwidth / columns;
			const rowHeight = Math.abs(yScale.map(columns * unit) - yScale.map(0));
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [index, x] of xs.entries()) {
				const value = values[index];
				if (!isPlaceable(x) || value === undefined) continue;
				const series = seriesOf(index);
				const cells = Math.max(0, Math.round(value / unit));
				let top = Number.POSITIVE_INFINITY;
				for (let cell = 0; cell < cells; cell += 1) {
					const position = offsets[index] + cell;
					const column = position % columns;
					const row = Math.floor(position / columns);
					const y = yScale.map((row + 1) * columns * unit);
					top = Math.min(top, y);
					nodes.push({
						kind: "rect",
						key: `${id}:${index}:${cell}`,
						series: series.key,
						role: "mark",
						x: xScale.map(x) + column * cellWidth + CELL_GAP / 2,
						y: y + CELL_GAP / 2,
						width: Math.max(0, cellWidth - CELL_GAP),
						height: Math.max(0, rowHeight - CELL_GAP),
						corners: [1.5, 1.5, 1.5, 1.5],
						paint: paint({ fill: series.color, opacity: options.opacity }),
					});
				}
				if (tips(options.tip, data[index], index)) {
					points.push({
						key: `${id}:${index}`,
						markId: id,
						index,
						datum: data[index],
						x: xScale.center(x),
						y: Number.isFinite(top) ? top : yScale.map(0),
						xValue: x,
						yValue: value,
						series: series.key,
						seriesLabel: series.label,
						color: series.color,
						title: context.formatX(x),
						value: context.formatY(value),
					});
				}
			}
			return { nodes, points };
		},
	};
}
