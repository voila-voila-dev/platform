import { ChartArea } from "#/chart/components/chart-area.tsx";
import { ChartBars } from "#/chart/components/chart-bars.tsx";
import { ChartCursor } from "#/chart/components/chart-cursor.tsx";
import { ChartDonut } from "#/chart/components/chart-donut.tsx";
import { ChartEmpty } from "#/chart/components/chart-empty.tsx";
import { ChartFunnel } from "#/chart/components/chart-funnel.tsx";
import { ChartGrid } from "#/chart/components/chart-grid.tsx";
import { ChartLabelList } from "#/chart/components/chart-label-list.tsx";
import { ChartLegend } from "#/chart/components/chart-legend.tsx";
import { ChartLegendContent } from "#/chart/components/chart-legend-content.tsx";
import { ChartLine } from "#/chart/components/chart-line.tsx";
import { ChartPie } from "#/chart/components/chart-pie.tsx";
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
import { ChartTooltip } from "#/chart/components/chart-tooltip.tsx";
import { ChartTooltipContent } from "#/chart/components/chart-tooltip-content.tsx";
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
 */
export const Chart = {
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
	Funnel: ChartFunnel,
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
export const useChart = useChartContext;
