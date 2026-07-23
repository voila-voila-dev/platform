import { cn } from "@voila.dev/ui/lib/utils";
import type * as React from "react";

import { useChartContext } from "#/context/chart-context.tsx";
import { axisAngle, polarFrame, polarToCartesian } from "#/core/polar.ts";

/**
 * The category labels around a radar chart. Each one is anchored away from the
 * centre, so a label on the left reads right-to-left into the chart rather than
 * overlapping it.
 */

export interface ChartPolarAngleAxisProps extends React.ComponentProps<"g"> {
	readonly tickFormatter?: (value: string) => string;
	/** Pixels between the outer ring and the labels. */
	readonly tickMargin?: number;
	readonly inset?: number;
}

/** Below this much horizontal offset a label is treated as centred. */
const ANCHOR_EPSILON = 1;

function ChartPolarAngleAxis({
	className,
	tickFormatter,
	tickMargin = 10,
	inset = 24,
	...props
}: ChartPolarAngleAxisProps) {
	const { innerWidth, innerHeight, categories } = useChartContext();
	const { cx, cy, radius } = polarFrame({ innerWidth, innerHeight, inset });
	const count = categories.length;

	if (count === 0) {
		return null;
	}

	return (
		<g
			data-slot="chart-polar-angle-axis"
			className={cn("fill-muted-foreground text-[10px]", className)}
			{...props}
		>
			{categories.map((category, index) => {
				const point = polarToCartesian(
					cx,
					cy,
					radius + tickMargin,
					axisAngle(index, count),
				);
				const offset = point.x - cx;
				return (
					<text
						key={category}
						data-slot="chart-polar-tick"
						x={point.x}
						y={point.y}
						dy="0.32em"
						textAnchor={
							Math.abs(offset) < ANCHOR_EPSILON
								? "middle"
								: offset > 0
									? "start"
									: "end"
						}
						className="stroke-none"
					>
						{tickFormatter ? tickFormatter(category) : category}
					</text>
				);
			})}
		</g>
	);
}

export { ChartPolarAngleAxis };
