import type * as React from "react";
import { ChartTooltipMarker } from "#/chart/components/chart-tooltip-marker.tsx";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { readNumber } from "#/chart/core/chart-model.ts";
import { configKeyFor, seriesColor } from "#/chart/core/config.ts";
import { formatTickValue } from "#/chart/core/format.ts";
import type { ChartTooltipIndicator } from "#/chart/core/types.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	/** Drops the heading, leaving the series rows. */
	readonly hideLabel?: boolean;
	/** Drops the colour swatch from each row. */
	readonly hideIndicator?: boolean;
	/** Shape of that swatch: a dot, a line or a filled block. */
	readonly indicator?: ChartTooltipIndicator;
	/** Field naming the config entry, for charts coloured per row. */
	readonly nameKey?: string;
	/** Field holding the panel's heading. Defaults to the category. */
	readonly labelKey?: string;
	/** Classes for the heading row only. */
	readonly labelClassName?: string;
	/** Formats one series row. Use it for units and locale. */
	readonly formatter?: (
		value: number,
		name: React.ReactNode,
		configKey: string,
	) => React.ReactNode;
	/** Formats the heading — usually where a raw date becomes a readable one. */
	readonly labelFormatter?: (label: string) => React.ReactNode;
}

/**
 * The tooltip's default body — one row per series, with the label on top.
 *
 * It is announced politely rather than assertively: scrubbing across a chart
 * fires a lot of updates, and interrupting the reader on every one of them
 * would be worse than silence.
 */
export function ChartTooltipContent({
	className,
	hideLabel = false,
	hideIndicator = false,
	indicator = "dot",
	nameKey,
	labelKey,
	labelClassName,
	formatter,
	labelFormatter,
	...props
}: Props) {
	const { active, data, categories, valueKeys, config } = useChartContext();

	if (active === null) {
		return null;
	}
	const datum = data[active.index];
	if (datum === undefined) {
		return null;
	}

	const rawLabel =
		labelKey === undefined
			? (categories[active.index] ?? "")
			: String(datum[labelKey] ?? "");
	const label = labelFormatter ? labelFormatter(rawLabel) : rawLabel;

	return (
		<div
			data-slot="chart-tooltip-content"
			role="status"
			aria-live="polite"
			className={cn(
				"grid min-w-32 items-start gap-1.5 rounded-lg bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10",
				className,
			)}
			{...props}
		>
			{hideLabel ? null : (
				<div className={cn("font-medium", labelClassName)}>{label}</div>
			)}
			<div className="grid gap-1.5">
				{valueKeys.map((key, index) => {
					const configKey = configKeyFor(datum, key, nameKey);
					const name = config[configKey]?.label ?? configKey;
					const value = readNumber(datum, key);
					const Icon = config[configKey]?.icon;
					return (
						<div
							key={key}
							data-slot="chart-tooltip-row"
							data-series={key}
							className="flex w-full items-center gap-2 leading-none"
						>
							{hideIndicator ? null : Icon ? (
								<Icon />
							) : (
								<ChartTooltipMarker
									indicator={indicator}
									color={seriesColor(config, configKey, index)}
								/>
							)}
							{formatter ? (
								formatter(value, name, configKey)
							) : (
								<div className="flex flex-1 items-center justify-between gap-2">
									<span className="text-muted-foreground">{name}</span>
									<span className="font-medium font-mono text-foreground tabular-nums">
										{formatTickValue(value)}
									</span>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
