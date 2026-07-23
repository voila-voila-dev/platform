import { cn } from "@voila.dev/ui/lib/utils";
import type * as React from "react";

import { useChartContext } from "#/context/chart-context.tsx";
import { formatTickValue } from "#/core/format.ts";

/**
 * A marker line across the plot at one value — a target, a threshold, or the
 * zero baseline a chart with negative values needs in order to be readable.
 */

export interface ChartReferenceLineProps extends React.ComponentProps<"g"> {
	/** Position on the value axis. */
	readonly value: number;
	readonly label?: string;
	readonly strokeDasharray?: string;
}

function ChartReferenceLine({
	className,
	value,
	label,
	strokeDasharray = "4 4",
	...props
}: ChartReferenceLineProps) {
	const { valueScale, orientation, innerWidth, innerHeight } =
		useChartContext();
	const offset = valueScale.scale(value);
	const isVertical = orientation === "vertical";

	return (
		<g
			data-slot="chart-reference-line"
			data-value={value}
			className={cn("stroke-border", className)}
			{...props}
		>
			<line
				x1={isVertical ? 0 : offset}
				x2={isVertical ? innerWidth : offset}
				y1={isVertical ? offset : 0}
				y2={isVertical ? offset : innerHeight}
				strokeDasharray={strokeDasharray}
			/>
			<text
				data-slot="chart-reference-label"
				x={isVertical ? innerWidth : offset}
				y={isVertical ? offset : 0}
				dx={isVertical ? -4 : 4}
				dy={isVertical ? -4 : 10}
				textAnchor={isVertical ? "end" : "start"}
				className="fill-muted-foreground stroke-none text-[10px]"
			>
				{label ?? formatTickValue(value)}
			</text>
		</g>
	);
}

export { ChartReferenceLine };
