import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { readNumber } from "#/chart/core/chart-model.ts";
import { configKeyFor, seriesColor, seriesLabel } from "#/chart/core/config.ts";
import { formatPercentage, formatTickValue } from "#/chart/core/format.ts";
import { funnelSlices } from "#/chart/core/funnel.ts";
import { cn } from "#/lib/utils.ts";

/**
 * The funnel mark. Each row of data is one step, drawn as a trapezoid whose
 * left edge is proportional to the step's value and whose right flank slopes
 * down to the next step — the drop between two stages is the shape itself.
 * Like the pie, colours come from the row rather than from a series.
 */

interface Props extends React.ComponentProps<"g"> {
	/** Field holding each step's size. Defaults to the first value key. */
	readonly dataKey?: string;
	/** Field naming each step's config entry. Defaults to the category field. */
	readonly nameKey?: string;
	/** Pixels of blank between two steps. */
	readonly gap?: number;
	/** Drops the per-step label and value above the shape. */
	readonly hideLabels?: boolean;
	/** Drops the conversion badge between two steps. */
	readonly hideConversion?: boolean;
	/** Formats each step's value. Use it for units and locale. */
	readonly valueFormatter?: (value: number) => string;
	/** Formats the step-to-step conversion. Defaults to a percentage. */
	readonly ratioFormatter?: (ratio: number) => string;
}

/** Milliseconds each step waits behind the one before it, on entry. */
const STAGGER_MS = 40;
/** Room reserved above the shape for the step label and its value. */
const LABEL_ZONE = 40;
/** Rough glyph width at 10px, for sizing the conversion badge without measuring. */
const BADGE_GLYPH_WIDTH = 5.5;
const BADGE_HEIGHT = 18;
const BADGE_PADDING = 12;

export function ChartFunnel({
	className,
	dataKey,
	nameKey,
	gap = 8,
	hideLabels = false,
	hideConversion = false,
	valueFormatter = formatTickValue,
	ratioFormatter = formatPercentage,
	...props
}: Props) {
	const {
		data,
		categories,
		category,
		valueKeys,
		config,
		innerWidth,
		innerHeight,
		active,
	} = useChartContext();

	const key = dataKey ?? valueKeys[0];
	if (key === undefined) {
		return null;
	}

	const labelZone = hideLabels ? 0 : LABEL_ZONE;
	const shapeHeight = Math.max(0, innerHeight - labelZone);
	const centerY = labelZone + shapeHeight / 2;
	const slices = funnelSlices({
		values: data.map((datum) => readNumber(datum, key)),
		innerWidth,
		innerHeight,
		gap,
		centerY,
		maxHeight: shapeHeight,
	});

	return (
		<g data-slot="chart-funnel" className={className} {...props}>
			{slices.map((slice) => {
				const datum = data[slice.index];
				const configKey = configKeyFor(
					datum,
					categories[slice.index] ?? String(slice.index),
					nameKey ?? category?.key,
				);
				// Dimming the rest is how the active step stands out; with nothing
				// active every step is at full strength.
				const state =
					active === null
						? "idle"
						: active.index === slice.index
							? "active"
							: "muted";
				return (
					<g
						key={`${configKey}-${slice.index}`}
						data-slot="chart-funnel-step"
						data-series={configKey}
						data-index={slice.index}
						data-state={state}
						className="transition-opacity duration-150 data-[state=muted]:opacity-50"
					>
						{slice.path === "" ? null : (
							<path
								data-slot="chart-funnel-shape"
								data-chart-animate=""
								d={slice.path}
								fill={seriesColor(config, configKey, slice.index)}
								style={
									{
										"--chart-enter-delay": `${slice.index * STAGGER_MS}ms`,
									} as React.CSSProperties
								}
							/>
						)}
						{hideLabels ? null : (
							<g data-slot="chart-funnel-label">
								<text
									x={slice.x}
									y={4}
									dy="0.71em"
									className="fill-muted-foreground stroke-none text-[10px]"
								>
									{seriesLabel(config, configKey)}
								</text>
								<text
									x={slice.x}
									y={20}
									dy="0.71em"
									className="fill-foreground stroke-none font-medium font-mono text-xs tabular-nums"
								>
									{valueFormatter(readNumber(datum ?? {}, key))}
								</text>
							</g>
						)}
					</g>
				);
			})}
			{hideConversion
				? null
				: slices.map((slice) => {
						if (slice.ratioToNext === null) {
							return null;
						}
						const text = ratioFormatter(slice.ratioToNext);
						const badgeWidth = text.length * BADGE_GLYPH_WIDTH + BADGE_PADDING;
						// The badge sits on the boundary the ratio describes, in the gap
						// between the two flanks it connects.
						const boundaryX = slice.x + slice.width + gap / 2;
						return (
							<g
								key={`ratio-${slice.index}`}
								data-slot="chart-funnel-conversion"
								className={cn(
									"transition-opacity duration-150",
									active !== null &&
										active.index !== slice.index &&
										active.index !== slice.index + 1 &&
										"opacity-50",
								)}
							>
								<rect
									x={boundaryX - badgeWidth / 2}
									y={centerY - BADGE_HEIGHT / 2}
									width={badgeWidth}
									height={BADGE_HEIGHT}
									rx={BADGE_HEIGHT / 2}
									className="fill-popover stroke-foreground/10"
								/>
								<text
									x={boundaryX}
									y={centerY}
									dy="0.32em"
									textAnchor="middle"
									className="fill-foreground stroke-none font-medium text-[10px] tabular-nums"
								>
									{text}
								</text>
							</g>
						);
					})}
		</g>
	);
}
