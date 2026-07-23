import { cn } from "@voila.dev/ui/lib/utils";
import type * as React from "react";

import { type ArcOptions, arcPath } from "#/core/geometry.ts";

/**
 * One wedge of a pie or donut. Exposed on its own so a caller can build a
 * bespoke round chart out of the same part the built-in ones use.
 */

export interface ChartSliceProps
	extends ArcOptions,
		Omit<React.ComponentProps<"path">, "d" | "cx" | "cy"> {
	readonly state?: "idle" | "active" | "muted";
}

/** How far the active wedge lifts out of the ring. */
const ACTIVE_LIFT = 4;

function ChartSlice({
	cx,
	cy,
	innerRadius,
	outerRadius,
	startAngle,
	endAngle,
	state = "idle",
	className,
	...props
}: ChartSliceProps) {
	const path = arcPath({
		cx,
		cy,
		innerRadius,
		outerRadius: state === "active" ? outerRadius + ACTIVE_LIFT : outerRadius,
		startAngle,
		endAngle,
	});
	if (path === "") {
		return null;
	}

	return (
		<path
			data-slot="chart-slice"
			data-state={state}
			data-chart-animate=""
			d={path}
			className={cn(
				"stroke-background transition-opacity duration-150 data-[state=muted]:opacity-60",
				className,
			)}
			strokeWidth={2}
			{...props}
		/>
	);
}

export { ChartSlice };
