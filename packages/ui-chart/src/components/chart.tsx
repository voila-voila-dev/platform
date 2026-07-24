import { ChartArea } from "#/components/chart-area.tsx";
import { ChartBars } from "#/components/chart-bars.tsx";
import { ChartCursor } from "#/components/chart-cursor.tsx";
import { ChartEmpty } from "#/components/chart-empty.tsx";
import { ChartGrid } from "#/components/chart-grid.tsx";
import { ChartLabelList } from "#/components/chart-label-list.tsx";
import { ChartLegend, ChartLegendContent } from "#/components/chart-legend.tsx";
import { ChartLine } from "#/components/chart-line.tsx";
import { ChartDonut, ChartPie } from "#/components/chart-pie.tsx";
import { ChartPoints } from "#/components/chart-points.tsx";
import { ChartPolarAngleAxis } from "#/components/chart-polar-angle-axis.tsx";
import { ChartPolarGrid } from "#/components/chart-polar-grid.tsx";
import { ChartRadar } from "#/components/chart-radar.tsx";
import { ChartRadialBar } from "#/components/chart-radial-bar.tsx";
import { ChartReferenceLine } from "#/components/chart-reference-line.tsx";
import { ChartRoot } from "#/components/chart-root.tsx";
import { ChartSkeleton } from "#/components/chart-skeleton.tsx";
import { ChartSlice } from "#/components/chart-slice.tsx";
import { ChartStyle } from "#/components/chart-style.tsx";
import {
	ChartTooltip,
	ChartTooltipContent,
} from "#/components/chart-tooltip.tsx";
import { ChartXAxis } from "#/components/chart-x-axis.tsx";
import { ChartYAxis } from "#/components/chart-y-axis.tsx";
import { useChartContext } from "#/context/chart-context.tsx";

/**
 * The chart kit's public surface.
 *
 * `Chart.Root` frames the picture and `Chart.*` draws into it:
 *
 * ```tsx
 * <Chart.Root config={config} data={data} x={{ key: "month" }} y={{ keys: ["projects"] }}>
 *   <Chart.Grid />
 *   <Chart.XAxis />
 *   <Chart.Cursor />
 *   <Chart.Bars />
 *   <Chart.Tooltip />
 * </Chart.Root>
 * ```
 *
 * Every part is also a flat named export, for callers who would rather import
 * `ChartBars` than reach through the namespace.
 */
const Chart = {
	Root: ChartRoot,
	Style: ChartStyle,
	Grid: ChartGrid,
	XAxis: ChartXAxis,
	YAxis: ChartYAxis,
	Bars: ChartBars,
	Line: ChartLine,
	Area: ChartArea,
	Points: ChartPoints,
	ReferenceLine: ChartReferenceLine,
	LabelList: ChartLabelList,
	Pie: ChartPie,
	Donut: ChartDonut,
	Slice: ChartSlice,
	Radar: ChartRadar,
	PolarGrid: ChartPolarGrid,
	PolarAngleAxis: ChartPolarAngleAxis,
	RadialBar: ChartRadialBar,
	Cursor: ChartCursor,
	Tooltip: ChartTooltip,
	TooltipContent: ChartTooltipContent,
	Legend: ChartLegend,
	LegendContent: ChartLegendContent,
	Skeleton: ChartSkeleton,
	Empty: ChartEmpty,
} as const;

/** The chart the current part is drawing into. Throws outside a `Chart.Root`. */
const useChart = useChartContext;

export type { ChartAreaProps } from "#/components/chart-area.tsx";
export type { ChartBarsProps } from "#/components/chart-bars.tsx";
export type { ChartCursorProps } from "#/components/chart-cursor.tsx";
export type { ChartGridProps } from "#/components/chart-grid.tsx";
export type { ChartLabelListProps } from "#/components/chart-label-list.tsx";
export type {
	ChartLegendContentProps,
	ChartLegendProps,
} from "#/components/chart-legend.tsx";
export type { ChartLineProps } from "#/components/chart-line.tsx";
export type { ChartPieProps } from "#/components/chart-pie.tsx";
export type { ChartPointsProps } from "#/components/chart-points.tsx";
export type { ChartPolarAngleAxisProps } from "#/components/chart-polar-angle-axis.tsx";
export type { ChartPolarGridProps } from "#/components/chart-polar-grid.tsx";
export type { ChartRadarProps } from "#/components/chart-radar.tsx";
export type { ChartRadialBarProps } from "#/components/chart-radial-bar.tsx";
export type { ChartReferenceLineProps } from "#/components/chart-reference-line.tsx";
export type { ChartRootProps } from "#/components/chart-root.tsx";
export type { ChartSkeletonProps } from "#/components/chart-skeleton.tsx";
export type { ChartSliceProps } from "#/components/chart-slice.tsx";
export type {
	ChartTooltipContentProps,
	ChartTooltipIndicator,
	ChartTooltipProps,
} from "#/components/chart-tooltip.tsx";
export type { ChartXAxisProps } from "#/components/chart-x-axis.tsx";
export type { ChartYAxisProps } from "#/components/chart-y-axis.tsx";
export type { ChartContextValue } from "#/context/chart-context.tsx";
export type {
	ChartCategorySpec,
	ChartValueSpec,
} from "#/core/chart-model.ts";
export type { ChartConfig, ChartTheme } from "#/core/config.ts";
export type {
	ChartCurve,
	ChartDatum,
	ChartMargin,
	ChartOrientation,
} from "#/core/types.ts";
export type { ChartActive } from "#/hooks/use-chart-pointer.ts";
export {
	Chart,
	ChartArea,
	ChartBars,
	ChartCursor,
	ChartDonut,
	ChartEmpty,
	ChartGrid,
	ChartLabelList,
	ChartLegend,
	ChartLegendContent,
	ChartLine,
	ChartPie,
	ChartPoints,
	ChartPolarAngleAxis,
	ChartPolarGrid,
	ChartRadar,
	ChartRadialBar,
	ChartReferenceLine,
	ChartRoot,
	ChartSkeleton,
	ChartSlice,
	ChartStyle,
	ChartTooltip,
	ChartTooltipContent,
	ChartXAxis,
	ChartYAxis,
	useChart,
	useChartContext,
};
