import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { cn } from "#/lib/utils.ts";

/**
 * Reference lines behind the marks. `horizontal` and `vertical` name the
 * direction the lines run, not the axis they come from, so a vertical bar chart
 * with `horizontal` grid lines reads the way it looks.
 */

interface Props extends React.ComponentProps<"g"> {
	/** Draw the lines running across the value axis. */
	readonly horizontal?: boolean;
	/** Draw the lines running along the category axis. */
	readonly vertical?: boolean;
	/** Target number of grid lines. The scale rounds it to readable intervals. */
	readonly tickCount?: number;
	/** Dash pattern for the lines. Pass `undefined` for solid. */
	readonly strokeDasharray?: string;
}

export function ChartGrid({
	className,
	horizontal = true,
	vertical = false,
	tickCount = 5,
	strokeDasharray = "3 3",
	...props
}: Props) {
	const { categoryScale, valueScale, orientation, innerWidth, innerHeight } =
		useChartContext();
	const isVertical = orientation === "vertical";

	// The value axis contributes evenly spaced lines; the category axis
	// contributes one line per slot centre.
	const valueOffsets = valueScale
		.ticks(tickCount)
		.map((tick) => valueScale.scale(tick));
	const categoryOffsets = categoryScale.domain.map((category) =>
		categoryScale.center(category),
	);

	const horizontalOffsets = isVertical ? valueOffsets : categoryOffsets;
	const verticalOffsets = isVertical ? categoryOffsets : valueOffsets;

	return (
		<g
			data-slot="chart-grid"
			className={cn("stroke-border/60", className)}
			strokeDasharray={strokeDasharray}
			{...props}
		>
			{horizontal
				? horizontalOffsets.map((offset) => (
						<line
							key={`horizontal-${offset}`}
							data-slot="chart-grid-line"
							data-direction="horizontal"
							x1={0}
							x2={innerWidth}
							y1={offset}
							y2={offset}
						/>
					))
				: null}
			{vertical
				? verticalOffsets.map((offset) => (
						<line
							key={`vertical-${offset}`}
							data-slot="chart-grid-line"
							data-direction="vertical"
							x1={offset}
							x2={offset}
							y1={0}
							y2={innerHeight}
						/>
					))
				: null}
		</g>
	);
}
