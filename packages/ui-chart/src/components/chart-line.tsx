import { cn } from "@voila.dev/ui/lib/utils";
import type * as React from "react";

import { useChartContext } from "#/context/chart-context.tsx";
import { seriesColor } from "#/core/config.ts";
import { linePath } from "#/core/geometry.ts";
import { seriesPoints } from "#/core/series.ts";
import type { ChartCurve } from "#/core/types.ts";

/**
 * One line per series. The active datum grows a dot, so scrubbing with a finger
 * shows where you are without needing the tooltip to be readable at the same
 * time.
 */

export interface ChartLineProps extends React.ComponentProps<"g"> {
	readonly keys?: ReadonlyArray<string>;
	readonly curve?: ChartCurve;
	readonly strokeWidth?: number;
	/** Draw a dot on every point, not only the active one. */
	readonly dots?: boolean;
}

const ACTIVE_DOT_RADIUS = 4;
const DOT_RADIUS = 2.5;

function ChartLine({
	className,
	keys,
	curve = "monotone",
	strokeWidth = 2,
	dots = false,
	...props
}: ChartLineProps) {
	const {
		data,
		categories,
		categoryScale,
		valueScale,
		orientation,
		valueKeys,
		config,
		active,
	} = useChartContext();

	const drawnKeys = keys ?? valueKeys;

	return (
		<g data-slot="chart-line" className={cn(className)} {...props}>
			{drawnKeys.map((key, seriesIndex) => {
				const points = seriesPoints({
					data,
					categories,
					categoryScale,
					valueScale,
					orientation,
					key,
				});
				const color = seriesColor(config, key, seriesIndex);
				return (
					<g key={key} data-slot="chart-line-series" data-series={key}>
						<path
							data-slot="chart-line-path"
							data-chart-animate=""
							d={linePath(points, curve)}
							fill="none"
							stroke={color}
							strokeWidth={strokeWidth}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						{points.map((point, index) => {
							const isActive = active?.index === index;
							if (!dots && !isActive) {
								return null;
							}
							return (
								<circle
									key={`${key}-${categories[index] ?? index}`}
									data-slot="chart-dot"
									data-series={key}
									data-index={index}
									data-state={isActive ? "active" : "idle"}
									cx={point.x}
									cy={point.y}
									r={isActive ? ACTIVE_DOT_RADIUS : DOT_RADIUS}
									fill={color}
									className="stroke-background"
									strokeWidth={isActive ? 2 : 0}
								/>
							);
						})}
					</g>
				);
			})}
		</g>
	);
}

export { ChartLine };
