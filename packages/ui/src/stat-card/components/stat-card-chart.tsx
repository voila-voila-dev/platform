import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/**
 * Full-bleed chart slot pinned to the bottom edge of the card: the negative
 * margin cancels the card's bottom padding and the card's `overflow-hidden`
 * clips the chart to the rounded corners. Constrain the chart's height on the
 * `Chart.Root` itself (e.g. `className="h-16 w-full"`).
 */
export function StatCardChart({ className, ...props }: Props) {
	return (
		<div
			data-slot="stat-card-chart"
			className={cn(
				"mt-auto -mb-4 pt-2 group-data-[size=sm]/card:-mb-3",
				className,
			)}
			{...props}
		/>
	);
}
