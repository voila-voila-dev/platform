import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { barRects } from "#/chart/core/bars.ts";
import { seriesColor } from "#/chart/core/config.ts";
import { roundedBarPath } from "#/chart/core/geometry.ts";

/**
 * The bar mark. Grouped by default, stacked on request, and upright or on its
 * side depending on the root's orientation — one component rather than three,
 * because the only thing that changes between them is where the geometry lands.
 */

interface Props extends Omit<React.ComponentProps<"g">, "fill"> {
	/** Series to draw. Defaults to the root's value keys. */
	readonly keys?: ReadonlyArray<string>;
	/** Stacks the series into one bar per category instead of grouping them side by side. */
	readonly stacked?: boolean;
	/** Corner radius of each bar, in pixels. */
	readonly radius?: number;
	/** Pixels between two bars of the same category. */
	readonly gap?: number;
	/** Per-datum fill, for charts coloured by row rather than by series. */
	readonly fill?: (datum: Record<string, unknown>, index: number) => string;
}

/** Milliseconds each bar waits behind the one before it, on entry. */
const STAGGER_MS = 24;

export function ChartBars({
	className,
	keys,
	stacked,
	radius = 4,
	gap,
	fill,
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
		value,
	} = useChartContext();

	const drawnKeys = keys ?? valueKeys;
	const rects = barRects({
		data,
		keys: drawnKeys,
		categories,
		categoryScale,
		valueScale,
		orientation,
		stacked: stacked ?? value?.stacked ?? false,
		radius,
		gap,
	});

	return (
		<g data-slot="chart-bars" className={className} {...props}>
			{rects.map((rect) => {
				const path = roundedBarPath(rect);
				if (path === "") {
					return null;
				}
				// Dimming the rest is how the active bar stands out; with nothing
				// active every bar is at full strength.
				const state =
					active === null
						? "idle"
						: active.index === rect.index
							? "active"
							: "muted";
				return (
					<path
						key={`${rect.key}-${rect.index}`}
						data-slot="chart-bar"
						data-series={rect.key}
						data-index={rect.index}
						data-state={state}
						data-chart-animate=""
						d={path}
						fill={
							fill?.(data[rect.index] ?? {}, rect.index) ??
							seriesColor(config, rect.key, drawnKeys.indexOf(rect.key))
						}
						className="transition-opacity duration-150 data-[state=muted]:opacity-50"
						style={
							{
								"--chart-enter-delay": `${rect.index * STAGGER_MS}ms`,
							} as React.CSSProperties
						}
					/>
				);
			})}
		</g>
	);
}
