import { cn } from "@voila.dev/ui/lib/utils";
import type * as React from "react";
import { createPortal } from "react-dom";

import { useChartContext } from "#/context/chart-context.tsx";
import { readNumber } from "#/core/chart-model.ts";
import { configKeyFor, seriesColor } from "#/core/config.ts";
import { formatTickValue } from "#/core/format.ts";

/**
 * The readout for the active datum. `ChartTooltip` places it; the content is a
 * separate component so a caller can replace the body without reimplementing
 * the positioning, which is the fiddly half.
 *
 * It is announced politely rather than assertively: scrubbing across a chart
 * fires a lot of updates, and interrupting the reader on every one of them
 * would be worse than silence.
 */

export type ChartTooltipIndicator = "dot" | "line" | "dashed";

export interface ChartTooltipProps {
	/** Replaces the default body. */
	readonly content?: React.ReactNode;
	/** Pixels between the pointer and the panel. */
	readonly offset?: number;
	readonly className?: string;
}

/** Room the panel needs above the pointer before it stops flipping upwards. */
const PANEL_HEIGHT = 88;
/** Nominal half-width, used to keep the panel's edges on screen. */
const HALF_PANEL = 72;

/** Keeps the panel inside the given bounds rather than letting it hang off. */
function clamp(value: number, low: number, high: number): number {
	return Math.min(Math.max(value, low), high);
}

function ChartTooltip({ content, offset = 12, className }: ChartTooltipProps) {
	const { active, chartId, margin, overlay } = useChartContext();

	if (active === null || overlay === null) {
		return null;
	}

	// Positioned against the viewport and portalled to the document, not to the
	// chart's own overlay: a sparkline inside a card is both tiny and clipped by
	// `overflow-hidden`, and a readout the card cuts in half is worse than none.
	const box = overlay.getBoundingClientRect();
	const view = overlay.ownerDocument.defaultView;
	const viewportWidth = view?.innerWidth ?? box.right;
	const viewportHeight = view?.innerHeight ?? box.bottom;

	const anchorX = box.left + margin.left + active.x;
	const anchorY = box.top + margin.top + active.y;

	// The panel sits above the reader's finger, where it does not hide what is
	// being pointed at — unless the top of the window is in the way.
	const above = anchorY - PANEL_HEIGHT > 0;
	const left = clamp(anchorX, HALF_PANEL, viewportWidth - HALF_PANEL);
	const top = clamp(anchorY + (above ? -offset : offset), 0, viewportHeight);

	return createPortal(
		<div
			data-slot="chart-tooltip"
			// The `--color-<key>` variables are scoped to `[data-chart=<id>]`, and
			// the panel no longer lives inside the chart. Carrying the id onto it
			// keeps the series colours resolvable from the document body.
			data-chart={chartId}
			data-placement={above ? "above" : "below"}
			className={cn(
				"pointer-events-none fixed z-50 -translate-x-1/2",
				above && "-translate-y-full",
				className,
			)}
			style={{ left, top }}
		>
			{content ?? <ChartTooltipContent />}
		</div>,
		overlay.ownerDocument.body,
	);
}

export interface ChartTooltipContentProps extends React.ComponentProps<"div"> {
	readonly hideLabel?: boolean;
	readonly hideIndicator?: boolean;
	readonly indicator?: ChartTooltipIndicator;
	/** Field naming the config entry, for charts coloured per row. */
	readonly nameKey?: string;
	/** Field holding the panel's heading. Defaults to the category. */
	readonly labelKey?: string;
	readonly labelClassName?: string;
	readonly formatter?: (
		value: number,
		name: React.ReactNode,
		configKey: string,
	) => React.ReactNode;
	readonly labelFormatter?: (label: string) => React.ReactNode;
}

const indicatorClassNames: Record<ChartTooltipIndicator, string> = {
	dot: "h-2.5 w-2.5 rounded-[2px]",
	line: "h-2.5 w-1 rounded-[2px]",
	dashed: "h-2.5 w-0 border-[1.5px] border-dashed bg-transparent",
};

function ChartTooltipMarker({
	indicator,
	color,
}: {
	readonly indicator: ChartTooltipIndicator;
	readonly color: string;
}) {
	return (
		<div
			data-slot="chart-tooltip-marker"
			className={cn("shrink-0", indicatorClassNames[indicator])}
			style={{ backgroundColor: color, borderColor: color }}
		/>
	);
}

function ChartTooltipContent({
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
}: ChartTooltipContentProps) {
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

export { ChartTooltip, ChartTooltipContent };
