import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { seriesColor } from "#/chart/core/config.ts";
import { areaPath, linePath } from "#/chart/core/geometry.ts";
import { seriesPoints, stackBases } from "#/chart/core/series.ts";
import type { ChartCurve } from "#/chart/core/types.ts";

/**
 * A filled band under each series, with the same outline the line mark would
 * draw. Stacked areas sit on the running total of the series below them, so the
 * top edge reads as the total rather than as the last series.
 */

interface Props extends React.ComponentProps<"g"> {
	readonly keys?: ReadonlyArray<string>;
	readonly curve?: ChartCurve;
	readonly stacked?: boolean;
	readonly fillOpacity?: number;
	readonly strokeWidth?: number;
	/** Fade the fill towards the baseline instead of filling flat. */
	readonly gradient?: boolean;
}

export function ChartArea({
	className,
	keys,
	curve = "monotone",
	stacked,
	fillOpacity = 0.25,
	strokeWidth = 2,
	gradient = true,
	...props
}: Props) {
	const {
		chartId,
		data,
		categories,
		categoryScale,
		valueScale,
		orientation,
		valueKeys,
		config,
		value,
	} = useChartContext();

	const drawnKeys = keys ?? valueKeys;
	const isStacked = stacked ?? value?.stacked ?? false;
	const bases = isStacked ? stackBases(data, drawnKeys) : undefined;
	const baseline = valueScale.scale(valueScale.domain[0]);

	return (
		<g data-slot="chart-area" className={className} {...props}>
			{drawnKeys.map((key, seriesIndex) => {
				const base = bases?.get(key);
				const points = seriesPoints({
					data,
					categories,
					categoryScale,
					valueScale,
					orientation,
					key,
					base,
				});
				const color = seriesColor(config, key, seriesIndex);
				const gradientId = `${chartId}-fill-${key}`;
				// A stacked band closes onto the series below it rather than onto the
				// baseline, so its lower edge is the same curve run backwards. The
				// empty key contributes nothing, leaving just the running total.
				const lowerPoints = base
					? seriesPoints({
							data,
							categories,
							categoryScale,
							valueScale,
							orientation,
							key: "",
							base,
						})
					: undefined;
				return (
					<g key={key} data-slot="chart-area-series" data-series={key}>
						{gradient ? (
							<defs>
								<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor={color} stopOpacity={0.7} />
									<stop offset="95%" stopColor={color} stopOpacity={0.05} />
								</linearGradient>
							</defs>
						) : null}
						<path
							data-slot="chart-area-path"
							data-chart-animate=""
							d={
								lowerPoints === undefined
									? areaPath(points, baseline, curve)
									: `${linePath(points, curve)}${linePath(
											[...lowerPoints].reverse(),
											curve,
										).replace(/^M/, "L")}Z`
							}
							fill={gradient ? `url(#${gradientId})` : color}
							fillOpacity={gradient ? 1 : fillOpacity}
							stroke="none"
						/>
						<path
							data-slot="chart-area-line"
							data-chart-animate=""
							d={linePath(points, curve)}
							fill="none"
							stroke={color}
							strokeWidth={strokeWidth}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</g>
				);
			})}
		</g>
	);
}
