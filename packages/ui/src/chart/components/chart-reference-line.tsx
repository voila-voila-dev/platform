import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { formatTickValue } from "#/chart/core/format.ts";
import { cn } from "#/lib/utils.ts";

/**
 * A marker line across the plot — at one value (a target, a threshold, the
 * zero baseline a chart with negative values needs in order to be readable),
 * or at one category (today, on a chart whose categories are dates).
 */

interface BaseProps extends React.ComponentProps<"g"> {
	/** Text drawn beside the line — a target, a threshold, an average. */
	readonly label?: string;
	/** Dash pattern for the line. Pass `undefined` for solid. */
	readonly strokeDasharray?: string;
}

type Props = BaseProps &
	(
		| {
				/** Position on the value axis. */
				readonly value: number;
				readonly category?: never;
		  }
		| {
				/**
				 * The category the line sits before: it runs along the leading edge of
				 * that category's slot, between it and the one before.
				 */
				readonly category: string;
				readonly value?: never;
		  }
	);

export function ChartReferenceLine({
	className,
	value,
	category,
	label,
	strokeDasharray = "4 4",
	...props
}: Props) {
	const { valueScale, categoryScale, orientation, innerWidth, innerHeight } =
		useChartContext();
	// A category line crosses the category axis, so it runs the way a value
	// line does on the other orientation.
	const isVertical =
		category === undefined
			? orientation === "vertical"
			: orientation !== "vertical";
	const offset =
		category === undefined
			? valueScale.scale(value)
			: categoryScale.scale(category) -
				(categoryScale.step - categoryScale.bandwidth) / 2;

	return (
		<g
			data-slot="chart-reference-line"
			data-value={value}
			data-category={category}
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
				{label ?? (category === undefined ? formatTickValue(value) : category)}
			</text>
		</g>
	);
}
