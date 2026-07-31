import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { axisTicks } from "#/chart/core/axis.ts";
import { formatLabel } from "#/chart/core/format.ts";
import { cn } from "#/lib/utils.ts";

/** The left axis: values on a vertical chart, categories on a horizontal one. */

interface Props extends React.ComponentProps<"g"> {
	/** Draw the short mark beside each label. */
	readonly tickLine?: boolean;
	/** Draw the line along the axis itself. */
	readonly axisLine?: boolean;
	/** Target number of ticks. The scale rounds it to readable intervals. */
	readonly tickCount?: number;
	/** Minimum pixels between two labels before ticks start being dropped. */
	readonly minTickGap?: number;
	/** Gap between the axis and its labels. */
	readonly tickMargin?: number;
	/** Formats each label. Use it for units and locale. */
	readonly tickFormatter?: (value: number | string) => string;
	/** Keeps the scale but draws nothing — the axis still shapes the plot. */
	readonly hide?: boolean;
}

const TICK_LINE_LENGTH = 4;

export function ChartYAxis({
	className,
	tickLine = false,
	axisLine = false,
	tickCount = 5,
	minTickGap = 4,
	tickMargin = 8,
	tickFormatter,
	hide = false,
	...props
}: Props) {
	const { yScale, innerHeight } = useChartContext();
	if (hide) {
		return null;
	}

	const ticks = axisTicks(yScale, {
		count: tickCount,
		minTickGap,
		available: innerHeight,
	});
	const format = tickFormatter ?? formatLabel;

	return (
		<g
			data-slot="chart-y-axis"
			className={cn("stroke-border text-muted-foreground", className)}
			{...props}
		>
			{axisLine ? (
				<line
					data-slot="chart-axis-line"
					x1={0}
					x2={0}
					y1={0}
					y2={innerHeight}
				/>
			) : null}
			{ticks.map((tick) => (
				<g
					key={`${tick.value}`}
					data-slot="chart-y-axis-tick"
					transform={`translate(0,${tick.offset})`}
				>
					{tickLine ? (
						<line
							data-slot="chart-tick-line"
							x1={0}
							x2={-TICK_LINE_LENGTH}
							y1={0}
							y2={0}
						/>
					) : null}
					<text
						data-slot="chart-tick-label"
						x={-tickMargin}
						dy="0.32em"
						textAnchor="end"
						className="fill-muted-foreground stroke-none text-[10px]"
					>
						{format(tick.value)}
					</text>
				</g>
			))}
		</g>
	);
}
