export { type CompileOptions, compileChart } from "#/core/compile.ts";
export {
	type ChartAxisOptions,
	type ChartBuildContext,
	type ChartColorOptions,
	type ChartDefinition,
	type ChartPositionScaleOptions,
	type ChartSpec,
	defineChart,
} from "#/core/define-chart.ts";
export { formatDate, formatNumber, formatValue } from "#/core/format.ts";
export { type AreaOptions, areaX, areaY } from "#/core/marks/area.ts";
export { type BarOptions, barX, barY } from "#/core/marks/bar.ts";
export { type CellOptions, cell } from "#/core/marks/cell.ts";
export { type DotOptions, dot } from "#/core/marks/dot.ts";
export { type LineOptions, lineX, lineY } from "#/core/marks/line.ts";
export { type RuleOptions, ruleX, ruleY } from "#/core/marks/rule.ts";
export type { ChartMarkOptions } from "#/core/marks/shared.ts";
export { type TextOptions, text } from "#/core/marks/text.ts";
export {
	type ChartFocusStop,
	findNearest,
	focusStops,
} from "#/core/nearest.ts";
export { estimateTextWidth } from "#/core/text.ts";
export { DEFAULT_THEME } from "#/core/theme.ts";
export type * from "#/core/types.ts";
