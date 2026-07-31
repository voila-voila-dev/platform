import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { seriesColor } from "#/chart/core/config.ts";
import { linePath } from "#/chart/core/geometry.ts";
import { seriesPoints } from "#/chart/core/series.ts";
import type { ChartCurve } from "#/chart/core/types.ts";

/**
 * One line per series. The active datum grows a dot, so scrubbing with a finger
 * shows where you are without needing the tooltip to be readable at the same
 * time.
 */

interface Props extends React.ComponentProps<"g"> {
	/** Series to draw. Defaults to the root's value keys. */
	readonly keys?: ReadonlyArray<string>;
	/** How points are joined: `linear`, `monotone` or `step`. */
	readonly curve?: ChartCurve;
	/** Width of the line, in pixels. */
	readonly strokeWidth?: number;
	/** Draw a dot on every point, not only the active one. */
	readonly dots?: boolean;
}

const ACTIVE_DOT_RADIUS = 4;
const DOT_RADIUS = 2.5;

export function ChartLine({
	className,
	keys,
	curve = "monotone",
	strokeWidth = 2,
	dots = false,
	...props
}: Props) {
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
		<g data-slot="chart-line" className={className} {...props}>
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
