import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { type BarRect, barRects } from "#/chart/core/bars.ts";
import { readNumber } from "#/chart/core/chart-model.ts";
import { formatTickValue } from "#/chart/core/format.ts";
import { seriesPoints } from "#/chart/core/series.ts";
import type {
	ChartDatum,
	ChartDiscreteScale,
	ChartLinearScale,
	ChartOrientation,
	ChartPoint,
} from "#/chart/core/types.ts";
import { cn } from "#/lib/utils.ts";

/**
 * The value written beside each point of a series. Small charts read better
 * with the numbers on them than with an axis the reader has to trace back to.
 */

interface Props extends React.ComponentProps<"g"> {
	/** Series to label. Defaults to the first of the root's value keys. */
	readonly seriesKey?: string;
	/**
	 * Which mark the labels belong to, because the two anchor differently.
	 *
	 * `points` (the default) puts each label on the series point — right for
	 * `Chart.Line`, `Chart.Area` and `Chart.Points`.
	 *
	 * `bars` puts it at the end of that series' OWN bar. A grouped bar chart
	 * splits its category slot into one lane per series, while the series point
	 * sits at the centre of the whole slot — so the label lands over the middle
	 * of the group rather than over the bar it describes. With a single series
	 * the two coincide, which is why this only appears once a second key is
	 * added. Stacked bars have the same problem for a different reason: every
	 * segment but the first starts off a running total, not the baseline.
	 *
	 * Pass `bars` beside any `Chart.Bars`, mirroring the `stacked` and `gap` you
	 * gave it so the lanes line up.
	 */
	readonly marks?: "points" | "bars";
	/** Mirrors `Chart.Bars`; only read when `marks` is `bars`. */
	readonly stacked?: boolean;
	/** Mirrors `Chart.Bars`; only read when `marks` is `bars`. */
	readonly gap?: number;
	/** Distance from the mark, along the value axis. */
	readonly offset?: number;
	/** Formats each label. Use it for units and locale — the raw number is passed in. */
	readonly formatter?: (value: number) => string;
}

/**
 * The end of a bar that points away from the baseline — where its label goes —
 * centred across the lane the bar occupies.
 */
function barAnchor(rect: BarRect, orientation: ChartOrientation): ChartPoint {
	if (orientation === "vertical") {
		return {
			x: rect.x + rect.width / 2,
			y: rect.value < 0 ? rect.y + rect.height : rect.y,
		};
	}
	return {
		x: rect.value < 0 ? rect.x : rect.x + rect.width,
		y: rect.y + rect.height / 2,
	};
}

interface AnchorOptions {
	readonly marks: "points" | "bars";
	readonly data: ReadonlyArray<ChartDatum>;
	readonly keys: ReadonlyArray<string>;
	readonly key: string;
	readonly categories: ReadonlyArray<string>;
	readonly categoryScale: ChartDiscreteScale;
	readonly valueScale: ChartLinearScale;
	readonly orientation: ChartOrientation;
	readonly stacked: boolean;
	readonly gap: number | undefined;
}

/** One anchor per datum, in datum order, for whichever mark is being labelled. */
function anchorsFor(options: AnchorOptions): ReadonlyArray<ChartPoint> {
	if (options.marks === "points") {
		return seriesPoints(options);
	}

	// Laid out with the FULL key set, not just the labelled one: which lane a bar
	// occupies depends on how many series share its slot.
	const rects = barRects(options);
	const byIndex = new Map(
		rects
			.filter((rect) => rect.key === options.key)
			.map((rect) => [rect.index, rect] as const),
	);
	return options.data.map((_, index) => {
		const rect = byIndex.get(index);
		// Unreachable for a key that is in `keys`, which it always is; the origin
		// is a harmless fallback rather than a crash mid-render.
		return rect === undefined
			? { x: 0, y: 0 }
			: barAnchor(rect, options.orientation);
	});
}

export function ChartLabelList({
	className,
	seriesKey,
	marks = "points",
	stacked,
	gap,
	offset = 8,
	formatter = formatTickValue,
	...props
}: Props) {
	const {
		data,
		categories,
		categoryScale,
		valueScale,
		orientation,
		valueKeys,
		value,
	} = useChartContext();

	const key = seriesKey ?? valueKeys[0];
	if (key === undefined) {
		return null;
	}

	const isVertical = orientation === "vertical";
	const anchors = anchorsFor({
		marks,
		data,
		keys: valueKeys,
		key,
		categories,
		categoryScale,
		valueScale,
		orientation,
		stacked: stacked ?? value?.stacked ?? false,
		gap,
	});

	return (
		<g
			data-slot="chart-label-list"
			data-series={key}
			className={cn("fill-foreground", className)}
			{...props}
		>
			{anchors.map((point, index) => {
				// Labels sit outside the mark, which means below it for a negative
				// value and to its left on a horizontal chart.
				const datumValue = readNumber(data[index] ?? {}, key);
				const away = datumValue < 0 ? -offset : offset;
				return (
					<text
						key={`${categories[index] ?? index}`}
						data-slot="chart-label"
						data-index={index}
						x={isVertical ? point.x : point.x + away}
						y={isVertical ? point.y - away : point.y}
						dy={isVertical ? 0 : "0.32em"}
						textAnchor={
							isVertical ? "middle" : datumValue < 0 ? "end" : "start"
						}
						className="stroke-none text-[10px] tabular-nums"
					>
						{formatter(datumValue)}
					</text>
				);
			})}
		</g>
	);
}
