import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { axisTicks } from "#/chart/core/axis.ts";
import { formatLabel } from "#/chart/core/format.ts";
import type { ChartScale } from "#/chart/core/types.ts";
import { cn } from "#/lib/utils.ts";

/** The bottom axis: categories on a vertical chart, values on a horizontal one. */

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
	/** Formats each label. Use it for units, dates and locale. */
	readonly tickFormatter?: (value: number | string) => string;
	/**
	 * The ticks to draw, instead of the evenly thinned set — the first week of
	 * each month on a weekly axis, say. Values not on the scale are skipped.
	 */
	readonly ticks?: ReadonlyArray<number | string>;
	/** Keeps the scale but draws nothing — useful behind a bar's own labels. */
	readonly hide?: boolean;
}

const TICK_LINE_LENGTH = 4;

/** A chosen tick's position, or `NaN` when the scale does not know it. */
function tickOffset(scale: ChartScale, value: number | string): number {
	if (scale.kind === "linear") {
		return typeof value === "number" ? scale.scale(value) : Number.NaN;
	}
	const category = String(value);
	return scale.domain.includes(category) ? scale.center(category) : Number.NaN;
}

export function ChartXAxis({
	className,
	tickLine = false,
	axisLine = false,
	tickCount = 5,
	minTickGap = 8,
	tickMargin = 8,
	tickFormatter,
	ticks: chosenTicks,
	hide = false,
	...props
}: Props) {
	const { xScale, innerWidth, innerHeight } = useChartContext();
	if (hide) {
		return null;
	}

	const ticks =
		chosenTicks === undefined
			? axisTicks(xScale, {
					count: tickCount,
					minTickGap,
					available: innerWidth,
				})
			: chosenTicks
					.map((value) => ({ value, offset: tickOffset(xScale, value) }))
					.filter((tick) => Number.isFinite(tick.offset));
	const format = tickFormatter ?? formatLabel;

	return (
		<g
			data-slot="chart-x-axis"
			transform={`translate(0,${innerHeight})`}
			className={cn("stroke-border text-muted-foreground", className)}
			{...props}
		>
			{axisLine ? (
				<line
					data-slot="chart-axis-line"
					x1={0}
					x2={innerWidth}
					y1={0}
					y2={0}
				/>
			) : null}
			{ticks.map((tick) => (
				<g
					key={`${tick.value}`}
					data-slot="chart-x-axis-tick"
					transform={`translate(${tick.offset},0)`}
				>
					{tickLine ? (
						<line
							data-slot="chart-tick-line"
							x1={0}
							x2={0}
							y1={0}
							y2={TICK_LINE_LENGTH}
						/>
					) : null}
					<text
						data-slot="chart-tick-label"
						y={tickMargin}
						dy="0.71em"
						textAnchor="middle"
						className="fill-muted-foreground stroke-none text-[10px]"
					>
						{format(tick.value)}
					</text>
				</g>
			))}
		</g>
	);
}
