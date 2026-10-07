import type { ChartAxisOptions } from "#/core/define-chart.ts";
import type {
	ChartPositionScale,
	ChartRect,
	ChartTextMeasurer,
	ChartTheme,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

/**
 * The axes as scene nodes: grid lines behind the marks, tick labels and
 * titles in front. They are measured before the plot exists, so the margins
 * fit the widest label instead of a guessed constant.
 */

const TICK_GAP = 8;
const TITLE_GAP = 6;
const LABEL_SPACING = 8;
const EDGE = 8;
/** A category label on a horizontal bar chart never takes more of the width than this. */
const MAX_CATEGORY_SHARE = 0.35;
const ELLIPSIS = "…";

export interface AxisMeasureInput {
	readonly scale: ChartPositionScale;
	readonly options: ChartAxisOptions | undefined;
	readonly title: string | undefined;
	readonly theme: ChartTheme;
	readonly measureText: ChartTextMeasurer;
}

export function axisTicks(
	scale: ChartPositionScale,
	options: ChartAxisOptions | undefined,
): ReadonlyArray<ChartValue> {
	const ticks = options?.ticks;
	if (Array.isArray(ticks)) {
		return ticks;
	}
	return scale.ticks(typeof ticks === "number" ? ticks : undefined);
}

export function tickLabel(
	scale: ChartPositionScale,
	options: ChartAxisOptions | undefined,
	value: ChartValue,
): string {
	return options?.tickFormat?.(value) ?? scale.format(value);
}

/** Cuts a label down to `maxWidth`, ending on an ellipsis. */
export function truncate(
	text: string,
	maxWidth: number,
	fontSize: number,
	measureText: ChartTextMeasurer,
): string {
	if (measureText(text, fontSize) <= maxWidth) {
		return text;
	}
	let kept = text;
	while (kept.length > 1 && measureText(kept + ELLIPSIS, fontSize) > maxWidth) {
		kept = kept.slice(0, -1);
	}
	return kept + ELLIPSIS;
}

function hidden(options: ChartAxisOptions | undefined): boolean {
	return options?.axis === false;
}

/** Room the left axis needs: its widest tick label, the gap, and the title. */
export function leftMargin(
	input: AxisMeasureInput,
	chartWidth: number,
): number {
	const { scale, options, title, theme, measureText } = input;
	if (hidden(options)) {
		return EDGE;
	}
	const discrete = scale.kind === "band" || scale.kind === "point";
	const widest = Math.max(
		0,
		...axisTicks(scale, options).map((tick) =>
			measureText(tickLabel(scale, options, tick), theme.fontSize),
		),
	);
	const labels = discrete
		? Math.min(widest, chartWidth * MAX_CATEGORY_SHARE)
		: widest;
	return EDGE + labels + TICK_GAP + (title ? theme.fontSize + TITLE_GAP : 0);
}

export function bottomMargin(input: AxisMeasureInput): number {
	const { options, title, theme } = input;
	if (hidden(options)) {
		return EDGE;
	}
	return (
		TICK_GAP +
		theme.fontSize +
		EDGE / 2 +
		(title ? theme.fontSize + TITLE_GAP : 0)
	);
}

/** Half the last x label hangs past the plot's right edge; leave it room. */
export function rightMargin(input: AxisMeasureInput): number {
	const { scale, options, theme, measureText } = input;
	if (hidden(options) || scale.kind === "band" || scale.kind === "point") {
		return EDGE;
	}
	const ticks = axisTicks(scale, options);
	const last = ticks[ticks.length - 1];
	if (last === undefined) {
		return EDGE;
	}
	const half = measureText(tickLabel(scale, options, last), theme.fontSize) / 2;
	const overhang = half - (scale.range[1] - scale.map(last));
	return Math.max(EDGE, overhang + 2);
}

export interface AxisNodes {
	readonly grid: ReadonlyArray<SceneNode>;
	readonly labels: ReadonlyArray<SceneNode>;
}

/**
 * Every `step`-th label, so neighbours never overlap. The step is the same
 * across the axis: thinning by skipping single labels reads as noise.
 */
function thinned(
	ticks: ReadonlyArray<ChartValue>,
	widths: ReadonlyArray<number>,
	positions: ReadonlyArray<number>,
): ReadonlyArray<number> {
	if (ticks.length < 2) {
		return ticks.map((_tick, index) => index);
	}
	const spacing = Math.abs(positions[1] - positions[0]) || 1;
	const widest = Math.max(...widths);
	const step = Math.max(1, Math.ceil((widest + LABEL_SPACING) / spacing));
	return ticks
		.map((_tick, index) => index)
		.filter((index) => index % step === 0);
}

export function bottomAxis(
	input: AxisMeasureInput,
	plot: ChartRect,
	grid: boolean,
): AxisNodes {
	const { scale, options, title, theme, measureText } = input;
	const ticks = axisTicks(scale, options);
	const positions = ticks.map((tick) => scale.center(tick));
	const gridNodes: SceneNode[] = grid
		? ticks.map((tick, index) => ({
				kind: "line",
				key: `grid-x:${tickLabel(scale, options, tick)}`,
				role: "grid",
				x1: positions[index],
				y1: plot.y,
				x2: positions[index],
				y2: plot.y + plot.height,
				paint: { stroke: theme.grid, strokeWidth: 1 },
			}))
		: [];
	if (hidden(options)) {
		return { grid: gridNodes, labels: [] };
	}
	const texts = ticks.map((tick) => tickLabel(scale, options, tick));
	const widths = texts.map((text) => measureText(text, theme.fontSize));
	const baseline = plot.y + plot.height + TICK_GAP;
	const labels: SceneNode[] = thinned(ticks, widths, positions).map(
		(index) => ({
			kind: "text",
			key: `tick-x:${texts[index]}`,
			role: "axis",
			x: positions[index],
			y: baseline,
			text: texts[index],
			paint: {
				fill: theme.muted,
				fontSize: theme.fontSize,
				textAnchor: "middle",
				baseline: "top",
			},
		}),
	);
	if (title) {
		labels.push({
			kind: "text",
			key: "title-x",
			role: "axis-title",
			x: plot.x + plot.width / 2,
			y: baseline + theme.fontSize + TITLE_GAP,
			text: title,
			paint: {
				fill: theme.muted,
				fontSize: theme.fontSize,
				fontWeight: 500,
				textAnchor: "middle",
				baseline: "top",
			},
		});
	}
	return { grid: gridNodes, labels };
}

export function leftAxis(
	input: AxisMeasureInput,
	plot: ChartRect,
	grid: boolean,
	chartWidth: number,
): AxisNodes {
	const { scale, options, title, theme, measureText } = input;
	const ticks = axisTicks(scale, options);
	const positions = ticks.map((tick) => scale.center(tick));
	const gridNodes: SceneNode[] = grid
		? ticks.map((tick, index) => ({
				kind: "line",
				key: `grid-y:${tickLabel(scale, options, tick)}`,
				role: "grid",
				x1: plot.x,
				y1: positions[index],
				x2: plot.x + plot.width,
				y2: positions[index],
				paint: { stroke: theme.grid, strokeWidth: 1 },
			}))
		: [];
	if (hidden(options)) {
		return { grid: gridNodes, labels: [] };
	}
	const discrete = scale.kind === "band" || scale.kind === "point";
	const maxWidth = discrete
		? chartWidth * MAX_CATEGORY_SHARE
		: Number.POSITIVE_INFINITY;
	const texts = ticks.map((tick) =>
		truncate(
			tickLabel(scale, options, tick),
			maxWidth,
			theme.fontSize,
			measureText,
		),
	);
	const heights = texts.map(() => theme.fontSize);
	const labels: SceneNode[] = thinned(ticks, heights, positions).map(
		(index) => ({
			kind: "text",
			key: `tick-y:${texts[index]}`,
			role: "axis",
			x: plot.x - TICK_GAP,
			y: positions[index],
			text: texts[index],
			paint: {
				fill: theme.muted,
				fontSize: theme.fontSize,
				textAnchor: "end",
				baseline: "middle",
			},
		}),
	);
	if (title) {
		labels.push({
			kind: "text",
			key: "title-y",
			role: "axis-title",
			x: EDGE / 2 + theme.fontSize / 2,
			y: plot.y + plot.height / 2,
			text: title,
			rotate: -90,
			paint: {
				fill: theme.muted,
				fontSize: theme.fontSize,
				fontWeight: 500,
				textAnchor: "middle",
				baseline: "middle",
			},
		});
	}
	return { grid: gridNodes, labels };
}
