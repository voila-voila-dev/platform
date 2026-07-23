import { cn } from "@voila.dev/ui/lib/utils";
import type * as React from "react";

import { useChartContext } from "#/context/chart-context.tsx";
import { polygonPath } from "#/core/geometry.ts";
import { polarFrame, ringPoints, ringRadii } from "#/core/polar.ts";

/**
 * The web behind a radar chart: rings at even value steps plus one spoke per
 * axis. The rings are polygons, not circles, so they meet the spokes exactly
 * where the data will.
 */

export interface ChartPolarGridProps extends React.ComponentProps<"g"> {
	readonly rings?: number;
	readonly spokes?: boolean;
	readonly inset?: number;
}

function ChartPolarGrid({
	className,
	rings = 4,
	spokes = true,
	inset = 24,
	...props
}: ChartPolarGridProps) {
	const { innerWidth, innerHeight, categories } = useChartContext();
	const { cx, cy, radius } = polarFrame({ innerWidth, innerHeight, inset });
	const axisCount = categories.length;

	if (axisCount === 0 || radius <= 0) {
		return null;
	}

	return (
		<g
			data-slot="chart-polar-grid"
			className={cn("fill-none stroke-border/60", className)}
			{...props}
		>
			{ringRadii(radius, rings).map((ringRadius) => (
				<path
					key={ringRadius}
					data-slot="chart-polar-ring"
					d={polygonPath(ringPoints(cx, cy, ringRadius, axisCount))}
				/>
			))}
			{spokes
				? ringPoints(cx, cy, radius, axisCount).map((point, index) => (
						<line
							key={categories[index] ?? index}
							data-slot="chart-polar-spoke"
							x1={cx}
							y1={cy}
							x2={point.x}
							y2={point.y}
						/>
					))
				: null}
		</g>
	);
}

export { ChartPolarGrid };
