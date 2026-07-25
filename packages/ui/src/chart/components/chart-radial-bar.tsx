import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { readNumber } from "#/chart/core/chart-model.ts";
import { configKeyFor, seriesColor } from "#/chart/core/config.ts";
import { arcPath } from "#/chart/core/geometry.ts";
import { polarFrame } from "#/chart/core/polar.ts";
import { cn } from "#/lib/utils.ts";

/**
 * Bars bent around the centre — one concentric track per row. Reads as a set of
 * gauges, which is what it is usually asked to be: a completion rate, a fill
 * rate, a share of a target.
 */

export interface ChartRadialBarProps extends React.ComponentProps<"g"> {
	readonly dataKey?: string;
	readonly nameKey?: string;
	/** Value that fills a whole track. Defaults to the value axis maximum. */
	readonly max?: number;
	readonly startAngle?: number;
	readonly endAngle?: number;
	/** Fraction of the radius left hollow in the middle. */
	readonly innerRadiusRatio?: number;
	/** Draw the unfilled remainder of each track. */
	readonly background?: boolean;
	readonly inset?: number;
	/** Pixels between two tracks. */
	readonly gap?: number;
}

function ChartRadialBar({
	className,
	dataKey,
	nameKey,
	max,
	startAngle = 0,
	endAngle = 360,
	innerRadiusRatio = 0.3,
	background = true,
	inset = 8,
	gap = 4,
	...props
}: ChartRadialBarProps) {
	const {
		data,
		innerWidth,
		innerHeight,
		valueKeys,
		valueScale,
		config,
		category,
		categories,
		active,
		setActive,
	} = useChartContext();

	const key = dataKey ?? valueKeys[0];
	if (key === undefined || data.length === 0) {
		return null;
	}

	const { cx, cy, radius } = polarFrame({ innerWidth, innerHeight, inset });
	const innerRadius = radius * innerRadiusRatio;
	const trackDepth = (radius - innerRadius) / data.length;
	const ceiling = max ?? valueScale.domain[1];
	const span = endAngle - startAngle;

	return (
		<g data-slot="chart-radial-bar" className={cn(className)} {...props}>
			{data.map((datum, index) => {
				// Track zero is the outermost, so the first row of data reads first.
				const trackOuter = radius - index * trackDepth;
				const trackInner = trackOuter - trackDepth + gap;
				const fraction =
					ceiling === 0 ? 0 : Math.min(1, readNumber(datum, key) / ceiling);
				const configKey = configKeyFor(
					datum,
					categories[index] ?? String(index),
					nameKey ?? category?.key,
				);
				const track = {
					cx,
					cy,
					innerRadius: trackInner,
					outerRadius: trackOuter,
				};
				return (
					<g
						key={configKey}
						data-slot="chart-radial-track"
						data-series={configKey}
						data-index={index}
						data-state={active?.index === index ? "active" : "idle"}
						onPointerEnter={() => setActive({ index, x: cx, y: cy })}
						onPointerLeave={() => setActive(null)}
					>
						{background ? (
							<path
								data-slot="chart-radial-background"
								d={arcPath({ ...track, startAngle, endAngle })}
								className="fill-muted"
							/>
						) : null}
						<path
							data-slot="chart-radial-value"
							data-chart-animate=""
							d={arcPath({
								...track,
								startAngle,
								endAngle: startAngle + span * fraction,
							})}
							fill={seriesColor(config, configKey, index)}
						/>
					</g>
				);
			})}
		</g>
	);
}

export { ChartRadialBar };
