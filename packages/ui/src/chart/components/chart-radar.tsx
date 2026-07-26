import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { readNumber } from "#/chart/core/chart-model.ts";
import { seriesColor } from "#/chart/core/config.ts";
import { polygonPath } from "#/chart/core/geometry.ts";
import { axisAngle, polarFrame, polarToCartesian } from "#/chart/core/polar.ts";

/**
 * One closed shape per series, with a vertex on every category axis. Radii come
 * from the value axis's domain, so two radar series on the same chart are
 * directly comparable.
 */

interface Props extends React.ComponentProps<"g"> {
	readonly keys?: ReadonlyArray<string>;
	readonly fillOpacity?: number;
	readonly strokeWidth?: number;
	readonly dots?: boolean;
	readonly inset?: number;
}

const DOT_RADIUS = 3;

export function ChartRadar({
	className,
	keys,
	fillOpacity = 0.35,
	strokeWidth = 2,
	dots = false,
	inset = 24,
	...props
}: Props) {
	const {
		data,
		innerWidth,
		innerHeight,
		categories,
		valueKeys,
		valueScale,
		config,
	} = useChartContext();

	const drawnKeys = keys ?? valueKeys;
	const { cx, cy, radius } = polarFrame({ innerWidth, innerHeight, inset });
	const [domainStart, domainEnd] = valueScale.domain;
	const span = domainEnd - domainStart;
	const count = categories.length;

	if (count === 0 || radius <= 0) {
		return null;
	}

	const radiusFor = (value: number): number =>
		span === 0 ? 0 : Math.max(0, ((value - domainStart) / span) * radius);

	return (
		<g data-slot="chart-radar" className={className} {...props}>
			{drawnKeys.map((key, seriesIndex) => {
				const color = seriesColor(config, key, seriesIndex);
				const vertices = data.map((datum, index) =>
					polarToCartesian(
						cx,
						cy,
						radiusFor(readNumber(datum, key)),
						axisAngle(index, count),
					),
				);
				return (
					<g key={key} data-slot="chart-radar-series" data-series={key}>
						<path
							data-slot="chart-radar-shape"
							data-chart-animate=""
							d={polygonPath(vertices)}
							fill={color}
							fillOpacity={fillOpacity}
							stroke={color}
							strokeWidth={strokeWidth}
							strokeLinejoin="round"
						/>
						{dots
							? vertices.map((vertex, index) => (
									<circle
										key={categories[index] ?? index}
										data-slot="chart-dot"
										data-series={key}
										data-index={index}
										cx={vertex.x}
										cy={vertex.y}
										r={DOT_RADIUS}
										fill={color}
									/>
								))
							: null}
					</g>
				);
			})}
		</g>
	);
}
