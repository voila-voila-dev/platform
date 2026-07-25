import { ChartArea } from "#/chart/components/chart-area.tsx";
import { ChartBars } from "#/chart/components/chart-bars.tsx";
import { ChartCursor } from "#/chart/components/chart-cursor.tsx";
import { ChartEmpty } from "#/chart/components/chart-empty.tsx";
import { ChartGrid } from "#/chart/components/chart-grid.tsx";
import { ChartLabelList } from "#/chart/components/chart-label-list.tsx";
import {
	ChartLegend,
	ChartLegendContent,
} from "#/chart/components/chart-legend.tsx";
import { ChartLine } from "#/chart/components/chart-line.tsx";
import { ChartDonut, ChartPie } from "#/chart/components/chart-pie.tsx";
import { ChartPoints } from "#/chart/components/chart-points.tsx";
import { ChartPolarAngleAxis } from "#/chart/components/chart-polar-angle-axis.tsx";
import { ChartPolarGrid } from "#/chart/components/chart-polar-grid.tsx";
import { ChartRadar } from "#/chart/components/chart-radar.tsx";
import { ChartRadialBar } from "#/chart/components/chart-radial-bar.tsx";
import { ChartReferenceLine } from "#/chart/components/chart-reference-line.tsx";
import { ChartRoot } from "#/chart/components/chart-root.tsx";
import { ChartSkeleton } from "#/chart/components/chart-skeleton.tsx";
import { ChartSlice } from "#/chart/components/chart-slice.tsx";
import { ChartStyle } from "#/chart/components/chart-style.tsx";
import {
	ChartTooltip,
	ChartTooltipContent,
} from "#/chart/components/chart-tooltip.tsx";
import { ChartXAxis } from "#/chart/components/chart-x-axis.tsx";
import { ChartYAxis } from "#/chart/components/chart-y-axis.tsx";
import { useChartContext } from "#/chart/context/chart-context.tsx";

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

export type { ChartAreaProps } from "#/chart/components/chart-area.tsx";
export type { ChartBarsProps } from "#/chart/components/chart-bars.tsx";
export type { ChartCursorProps } from "#/chart/components/chart-cursor.tsx";
export type { ChartGridProps } from "#/chart/components/chart-grid.tsx";
export type { ChartLabelListProps } from "#/chart/components/chart-label-list.tsx";
export type {
	ChartLegendContentProps,
	ChartLegendProps,
} from "#/chart/components/chart-legend.tsx";
export type { ChartLineProps } from "#/chart/components/chart-line.tsx";
export type { ChartPieProps } from "#/chart/components/chart-pie.tsx";
export type { ChartPointsProps } from "#/chart/components/chart-points.tsx";
export type { ChartPolarAngleAxisProps } from "#/chart/components/chart-polar-angle-axis.tsx";
export type { ChartPolarGridProps } from "#/chart/components/chart-polar-grid.tsx";
export type { ChartRadarProps } from "#/chart/components/chart-radar.tsx";
export type { ChartRadialBarProps } from "#/chart/components/chart-radial-bar.tsx";
export type { ChartReferenceLineProps } from "#/chart/components/chart-reference-line.tsx";
export type { ChartRootProps } from "#/chart/components/chart-root.tsx";
export type { ChartSkeletonProps } from "#/chart/components/chart-skeleton.tsx";
export type { ChartSliceProps } from "#/chart/components/chart-slice.tsx";
export type {
	ChartTooltipContentProps,
	ChartTooltipIndicator,
	ChartTooltipProps,
} from "#/chart/components/chart-tooltip.tsx";
export type { ChartXAxisProps } from "#/chart/components/chart-x-axis.tsx";
export type { ChartYAxisProps } from "#/chart/components/chart-y-axis.tsx";
export type { ChartContextValue } from "#/chart/context/chart-context.tsx";
export type {
	ChartCategorySpec,
	ChartValueSpec,
} from "#/chart/core/chart-model.ts";
export type { ChartConfig, ChartTheme } from "#/chart/core/config.ts";
export type {
	ChartCurve,
	ChartDatum,
	ChartMargin,
	ChartOrientation,
} from "#/chart/core/types.ts";
export type { ChartActive } from "#/chart/hooks/use-chart-pointer.ts";
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
