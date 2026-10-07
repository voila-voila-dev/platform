import type {
	ChartDefinition,
	ChartPositionScaleOptions,
	ChartSpec,
} from "#/core/define-chart.ts";
import { dateValueFormatter, formatValue } from "#/core/format.ts";
import {
	type AxisMeasureInput,
	bottomAxis,
	bottomMargin,
	leftAxis,
	leftMargin,
	rightMargin,
} from "#/core/guides/axes.ts";
import {
	ordinalColorScale,
	sequentialColorScale,
} from "#/core/scales/color.ts";
import { toNumber } from "#/core/scales/continuous.ts";
import { categoryKey } from "#/core/scales/discrete.ts";
import {
	buildScale,
	planScale,
	type ScalePlan,
} from "#/core/scales/resolve.ts";
import { estimateTextWidth } from "#/core/text.ts";
import { DEFAULT_THEME } from "#/core/theme.ts";
import type {
	ChartChannel,
	ChartColorScale,
	ChartFocusOrder,
	ChartLegendItem,
	ChartMargin,
	ChartMark,
	ChartPoint,
	ChartPositionScale,
	ChartRect,
	ChartScene,
	ChartTextMeasurer,
	ChartTheme,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

const DEFAULT_LOCALE = "fr-FR";
const EDGE = 8;
/** Pixels per tick an axis aims for: about one label every 80 px across, 48 px down. */
const X_TICK_SPACING = 80;
const Y_TICK_SPACING = 48;
const MIN_TICKS = 2;

export interface CompileOptions {
	readonly width: number;
	readonly height: number;
	readonly measureText?: ChartTextMeasurer;
	/** Series the legend has switched off. The scales keep their domain, so the axes hold still. */
	readonly hiddenSeries?: ReadonlySet<string>;
}

function distinctBy<T>(
	items: ReadonlyArray<T>,
	keyOf: (item: T) => string,
): T[] {
	const seen = new Set<string>();
	return items.filter((item) => {
		const key = keyOf(item);
		if (seen.has(key)) {
			return false;
		}
		seen.add(key);
		return true;
	});
}

function isMark(mark: ChartMark | false | null | undefined): mark is ChartMark {
	return Boolean(mark);
}

function channelsOf(
	marks: ReadonlyArray<ChartMark>,
	name: "x" | "y" | "color",
): ReadonlyArray<ChartChannel> {
	return marks.flatMap((mark) => {
		const channel = mark.channels[name];
		return channel === undefined ? [] : [channel];
	});
}

function tickCount(length: number, spacing: number): number {
	return Math.max(MIN_TICKS, Math.floor(length / spacing));
}

function colorScaleOf(
	spec: ChartSpec,
	channels: ReadonlyArray<ChartChannel>,
	theme: ChartTheme,
): ChartColorScale | undefined {
	if (channels.length === 0) {
		return undefined;
	}
	const options = spec.color;
	const values = channels.flatMap((channel) => channel.values);
	const sequential =
		options?.type === "sequential" ||
		(options?.type === undefined &&
			values.length > 0 &&
			values.every((value) => typeof value === "number"));
	if (sequential) {
		const numbers = (options?.domain ?? values).map(toNumber);
		const [from = theme.background, to = theme.palette[0]] = options?.range ?? [
			`color-mix(in oklab, ${theme.palette[0]} 12%, ${theme.background})`,
			theme.palette[0],
		];
		return sequentialColorScale(
			[Math.min(...numbers), Math.max(...numbers)],
			[from, to],
		);
	}
	const domain = distinctBy(options?.domain ?? values, categoryKey);
	return ordinalColorScale(domain, options?.range ?? theme.palette);
}

function withoutHidden(
	nodes: ReadonlyArray<SceneNode>,
	hidden: ReadonlySet<string>,
): ReadonlyArray<SceneNode> {
	if (hidden.size === 0) {
		return nodes;
	}
	return nodes
		.filter((node) => node.series === undefined || !hidden.has(node.series))
		.map((node) =>
			node.kind === "group"
				? { ...node, children: withoutHidden(node.children, hidden) }
				: node,
		);
}

function focusOrderOf(
	spec: ChartSpec,
	marks: ReadonlyArray<ChartMark>,
	x: ChartPositionScale | undefined,
	y: ChartPositionScale | undefined,
): ChartFocusOrder {
	if (spec.focus !== undefined) {
		return spec.focus;
	}
	if (
		marks.some(
			(mark) => mark.coordinate === "frame" || mark.focusOrder === "point",
		)
	) {
		return "point";
	}
	const yDiscrete = y?.kind === "band" || y?.kind === "point";
	const xDiscrete = x?.kind === "band" || x?.kind === "point";
	return yDiscrete && !xDiscrete ? "y" : "x";
}

function marginFor(
	spec: ChartSpec,
	width: number,
	xInput: AxisMeasureInput | undefined,
	yInput: AxisMeasureInput | undefined,
	fontSize: number,
): ChartMargin {
	const computed: ChartMargin = {
		top: yInput === undefined ? EDGE : Math.max(EDGE, fontSize / 2 + 2),
		right: xInput === undefined ? EDGE : rightMargin(xInput),
		bottom: xInput === undefined ? EDGE : bottomMargin(xInput),
		left: yInput === undefined ? EDGE : leftMargin(yInput, width),
	};
	return { ...computed, ...spec.margin };
}

/**
 * Definition and size in, scene out. Pure: the same inputs give the same
 * scene, on the server and in the browser, which is what lets the SVG render
 * on the server hydrate without a mismatch.
 */
export function compileChart(
	definition: ChartDefinition,
	options: CompileOptions,
): ChartScene {
	const { width, height } = options;
	const measureText = options.measureText ?? estimateTextWidth;
	const hidden = options.hiddenSeries ?? new Set<string>();
	const spec = definition.build({ width, height });
	const locale = spec.locale ?? DEFAULT_LOCALE;
	const theme: ChartTheme = { ...DEFAULT_THEME, ...spec.theme };
	const marks = spec.marks.filter(isMark);
	const cartesian = marks.filter((mark) => mark.coordinate === "cartesian");

	const xPlan = planScale(channelsOf(cartesian, "x"), spec.x, "x");
	const yPlan = planScale(channelsOf(cartesian, "y"), spec.y, "y");

	// First pass: scales over the whole chart, only to measure tick labels.
	function provisional(
		plan: ScalePlan | undefined,
		axisOptions: ChartPositionScaleOptions | undefined,
		range: readonly [number, number],
		count: number,
	): AxisMeasureInput | undefined {
		if (plan === undefined) {
			return undefined;
		}
		return {
			scale: buildScale(plan, axisOptions, range, locale, count),
			options: axisOptions,
			title: axisOptions?.label,
			theme,
			measureText,
		};
	}
	const yDiscrete = yPlan?.kind === "band" || yPlan?.kind === "point";
	const yRange = (top: number, bottom: number): readonly [number, number] =>
		yDiscrete ? [top, bottom] : [bottom, top];

	const margin = marginFor(
		spec,
		width,
		provisional(xPlan, spec.x, [0, width], tickCount(width, X_TICK_SPACING)),
		provisional(
			yPlan,
			spec.y,
			yRange(0, height),
			tickCount(height, Y_TICK_SPACING),
		),
		theme.fontSize,
	);
	const plot: ChartRect = {
		x: margin.left,
		y: margin.top,
		width: Math.max(0, width - margin.left - margin.right),
		height: Math.max(0, height - margin.top - margin.bottom),
	};

	function insetOf(name: "x" | "y"): number {
		return Math.max(
			0,
			...channelsOf(cartesian, name).map((channel) => channel.inset ?? 0),
		);
	}
	const xInset = insetOf("x");
	const yInset = insetOf("y");
	const x =
		xPlan &&
		buildScale(
			xPlan,
			spec.x,
			[plot.x + xInset, plot.x + plot.width - xInset],
			locale,
			tickCount(plot.width, X_TICK_SPACING),
		);
	const y =
		yPlan &&
		buildScale(
			yPlan,
			spec.y,
			yRange(plot.y + yInset, plot.y + plot.height - yInset),
			locale,
			tickCount(plot.height, Y_TICK_SPACING),
		);
	const color = colorScaleOf(spec, channelsOf(marks, "color"), theme);
	const scales = { x, y, color };

	function channelFormatter(
		channels: ReadonlyArray<ChartChannel>,
		custom: ((value: ChartValue) => string) | undefined,
	): (value: ChartValue) => string {
		if (custom !== undefined) {
			return custom;
		}
		const dates = dateValueFormatter(
			channels.flatMap((channel) => channel.values),
			locale,
		);
		return (value) =>
			dates !== undefined && value instanceof Date
				? dates(value)
				: formatValue(value, locale);
	}
	const formatX = channelFormatter(channelsOf(cartesian, "x"), spec.x?.format);
	const formatY = channelFormatter(channelsOf(cartesian, "y"), spec.y?.format);
	const seriesLabel = (value: ChartValue) =>
		spec.color?.labels?.[categoryKey(value)] ?? formatValue(value, locale);

	const grid: SceneNode[] = [];
	const guides: SceneNode[] = [];
	const xContinuous =
		x !== undefined && x.kind !== "band" && x.kind !== "point";
	const yContinuous =
		y !== undefined && y.kind !== "band" && y.kind !== "point";
	if (x !== undefined) {
		const axis = bottomAxis(
			{ scale: x, options: spec.x, title: spec.x?.label, theme, measureText },
			plot,
			spec.x?.grid ?? (xContinuous && !yContinuous),
		);
		grid.push(...axis.grid);
		guides.push(...axis.labels);
	}
	if (y !== undefined) {
		const axis = leftAxis(
			{ scale: y, options: spec.y, title: spec.y?.label, theme, measureText },
			plot,
			spec.y?.grid ?? yContinuous,
			width,
		);
		grid.push(...axis.grid);
		guides.push(...axis.labels);
	}

	const markNodes: SceneNode[] = [];
	const points: ChartPoint[] = [];
	const legend: ChartLegendItem[] = [];
	const paletteColor = (index: number) =>
		theme.palette[index % theme.palette.length];
	for (const [markIndex, mark] of marks.entries()) {
		const rendered = mark.render({
			scales,
			plot,
			theme,
			measureText,
			locale,
			paletteColor,
			colorOf: (value) => color?.map(value) ?? paletteColor(markIndex),
			seriesLabel,
			formatX,
			formatY,
			markIndex,
		});
		markNodes.push(...rendered.nodes);
		points.push(
			...(rendered.points ?? []).filter(
				(point) => point.series === undefined || !hidden.has(point.series),
			),
		);
		legend.push(...(rendered.legend ?? []));
	}

	if (color?.kind === "ordinal" && spec.color?.legend !== false) {
		for (const value of color.domain) {
			legend.push({
				key: categoryKey(value),
				label: seriesLabel(value),
				color: color.map(value),
				shape: "square",
			});
		}
	}

	return {
		width,
		height,
		plot,
		nodes: [
			{ kind: "group", key: "grid", role: "grid", children: grid },
			{
				kind: "group",
				key: "marks",
				role: "marks",
				children: withoutHidden(markNodes, hidden),
			},
			{ kind: "group", key: "axes", role: "axes", children: guides },
		],
		points,
		legend: distinctBy(legend, (item) => item.key),
		focusOrder: focusOrderOf(spec, marks, x, y),
		scales,
		xLabel: xPlan?.label ?? "x",
		yLabel: yPlan?.label ?? "y",
		theme,
		locale,
	};
}
