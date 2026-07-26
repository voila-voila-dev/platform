import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { configKeyFor, seriesColor } from "#/chart/core/config.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	readonly hideIcon?: boolean;
	/**
	 * Field naming the config entry for each row. Pass it on charts coloured per
	 * row (a pie): without it the legend lists the series instead.
	 */
	readonly nameKey?: string;
}

/**
 * The legend's default body — one swatch and label per series, or per row when
 * `nameKey` is set. Split from `ChartLegend` so a caller can replace the body
 * without reimplementing the portal.
 */
export function ChartLegendContent({
	className,
	hideIcon = false,
	nameKey,
	...props
}: Props) {
	const { config, data, valueKeys } = useChartContext();

	const entries =
		nameKey === undefined
			? valueKeys.map((key, index) => ({ key, index }))
			: data.map((datum, index) => ({
					key: configKeyFor(datum, String(index), nameKey),
					index,
				}));

	return (
		<div
			data-slot="chart-legend-content"
			className={cn(
				"flex flex-wrap items-center justify-center gap-x-4 gap-y-1",
				className,
			)}
			{...props}
		>
			{entries.map(({ key, index }) => {
				const Icon = config[key]?.icon;
				return (
					<div
						key={`${key}-${index}`}
						data-slot="chart-legend-item"
						data-series={key}
						className="flex items-center gap-1.5 text-muted-foreground text-xs"
					>
						{Icon !== undefined && !hideIcon ? (
							<Icon />
						) : (
							<span
								data-slot="chart-legend-swatch"
								className="h-2 w-2 shrink-0 rounded-[2px]"
								style={{ backgroundColor: seriesColor(config, key, index) }}
							/>
						)}
						{config[key]?.label ?? key}
					</div>
				);
			})}
		</div>
	);
}
