import type * as React from "react";
import { createPortal } from "react-dom";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { configKeyFor, seriesColor } from "#/chart/core/config.ts";
import { cn } from "#/lib/utils.ts";

/**
 * The colour key. Portals into the root's overlay layer, so it composes inside
 * `Chart.Root` like every other part while still being ordinary HTML — leave
 * room for it in the root's `margin`.
 */

export interface ChartLegendProps {
	readonly content?: React.ReactNode;
	readonly align?: "top" | "bottom";
	readonly className?: string;
}

function ChartLegend({
	content,
	align = "bottom",
	className,
}: ChartLegendProps) {
	const { overlay } = useChartContext();
	if (overlay === null) {
		return null;
	}

	return createPortal(
		<div
			data-slot="chart-legend"
			data-align={align}
			className={cn(
				"pointer-events-auto absolute inset-x-0",
				align === "top" ? "top-0" : "bottom-0",
				className,
			)}
		>
			{content ?? <ChartLegendContent />}
		</div>,
		overlay,
	);
}

export interface ChartLegendContentProps extends React.ComponentProps<"div"> {
	readonly hideIcon?: boolean;
	/**
	 * Field naming the config entry for each row. Pass it on charts coloured per
	 * row (a pie): without it the legend lists the series instead.
	 */
	readonly nameKey?: string;
}

function ChartLegendContent({
	className,
	hideIcon = false,
	nameKey,
	...props
}: ChartLegendContentProps) {
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

export { ChartLegend, ChartLegendContent };
