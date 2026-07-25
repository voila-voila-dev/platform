import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { readNumber } from "#/chart/core/chart-model.ts";
import { seriesColor } from "#/chart/core/config.ts";
import { seriesPoints } from "#/chart/core/series.ts";
import { cn } from "#/lib/utils.ts";

/** The scatter mark: one dot per datum per series, optionally sized by a field. */

export interface ChartPointsProps extends React.ComponentProps<"g"> {
	readonly keys?: ReadonlyArray<string>;
	readonly radius?: number;
	/** Field driving the dot area, for a bubble chart. */
	readonly sizeKey?: string;
	readonly maxRadius?: number;
}

/** Milliseconds each dot waits behind the one before it, on entry. */
const STAGGER_MS = 16;

function ChartPoints({
	className,
	keys,
	radius = 4,
	sizeKey,
	maxRadius = 14,
	...props
}: ChartPointsProps) {
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
	// Area, not radius, carries the size: doubling a value should double the ink.
	const largestSize =
		sizeKey === undefined
			? 0
			: Math.max(...data.map((datum) => readNumber(datum, sizeKey)), 0);

	const radiusFor = (index: number): number => {
		if (sizeKey === undefined || largestSize <= 0) {
			return radius;
		}
		const share = readNumber(data[index] ?? {}, sizeKey) / largestSize;
		return Math.max(2, maxRadius * Math.sqrt(share));
	};

	return (
		<g data-slot="chart-points" className={cn(className)} {...props}>
			{drawnKeys.map((key, seriesIndex) => {
				const color = seriesColor(config, key, seriesIndex);
				return seriesPoints({
					data,
					categories,
					categoryScale,
					valueScale,
					orientation,
					key,
				}).map((point, index) => (
					<circle
						key={`${key}-${categories[index] ?? index}`}
						data-slot="chart-point"
						data-series={key}
						data-index={index}
						data-state={active?.index === index ? "active" : "idle"}
						data-chart-animate=""
						cx={point.x}
						cy={point.y}
						r={radiusFor(index)}
						fill={color}
						fillOpacity={active?.index === index ? 1 : 0.75}
						className="stroke-background"
						strokeWidth={1}
						style={
							{
								"--chart-enter-delay": `${index * STAGGER_MS}ms`,
							} as React.CSSProperties
						}
					/>
				));
			})}
		</g>
	);
}

export { ChartPoints };
