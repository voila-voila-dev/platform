export { type CompileOptions, compileChart } from "#/core/compile.ts";
export {
	type ChartAxisOptions,
	type ChartBuildContext,
	type ChartColorOptions,
	type ChartDefinition,
	type ChartFacet,
	type ChartFacetOptions,
	type ChartPositionScaleOptions,
	type ChartSpec,
	defineChart,
} from "#/core/define-chart.ts";
export { facet } from "#/core/facet.ts";
export { formatDate, formatNumber, formatValue } from "#/core/format.ts";
export { type AreaOptions, areaX, areaY } from "#/core/marks/area.ts";
export { type BarOptions, barX, barY } from "#/core/marks/bar.ts";
export { type CellOptions, cell } from "#/core/marks/cell.ts";
export { type DotOptions, dot } from "#/core/marks/dot.ts";
export { type FunnelOptions, funnel } from "#/core/marks/funnel.ts";
export { type LineOptions, lineX, lineY } from "#/core/marks/line.ts";
export {
	type ArcOptions,
	arc,
	donut,
	type RadarOptions,
	type RadialBarOptions,
	radar,
	radialBar,
} from "#/core/marks/polar.ts";
export { type RectOptions, rectY } from "#/core/marks/rect.ts";
export { type RuleOptions, ruleX, ruleY } from "#/core/marks/rule.ts";
export type { ChartMarkOptions } from "#/core/marks/shared.ts";
export {
	type DifferenceOptions,
	differenceY,
} from "#/core/marks/stats/difference.ts";
export {
	type BoxOptions,
	boxY,
	type RidgelineOptions,
	ridgeline,
	violinY,
} from "#/core/marks/stats/distribution.ts";
export { type DodgeOptions, dodgeY } from "#/core/marks/stats/dodge.ts";
export { type HexbinOptions, hexbin } from "#/core/marks/stats/hexbin.ts";
export {
	type HistogramOptions,
	histogram,
} from "#/core/marks/stats/histogram.ts";
export {
	type RegressionOptions,
	regressionY,
} from "#/core/marks/stats/regression.ts";
export {
	boxSummary,
	kernelDensity,
	linearFit,
	quantile,
} from "#/core/marks/stats/statistics.ts";
export { type WaffleOptions, waffleY } from "#/core/marks/stats/waffle.ts";
export { type TextOptions, text } from "#/core/marks/text.ts";
export { type TickOptions, tickX, tickY } from "#/core/marks/tick.ts";
export {
	createMotionStore,
	type MotionStore,
} from "#/core/motion/motion-store.ts";
export {
	type ChartAnimation,
	type ChartTiming,
	chartTiming,
} from "#/core/motion/timing.ts";
export { easeOutCubic, tweenScene } from "#/core/motion/tween.ts";
export {
	type ChartFocusStop,
	findNearest,
	focusStops,
} from "#/core/nearest.ts";
export { estimateTextWidth } from "#/core/text.ts";
export { DEFAULT_THEME } from "#/core/theme.ts";
export type * from "#/core/types.ts";
