import type * as React from "react";
import { ChartCursorBand } from "#/chart/components/chart-cursor-band.tsx";
import { ChartCursorLine } from "#/chart/components/chart-cursor-line.tsx";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import type { ChartCursorGeometry } from "#/chart/core/types.ts";

interface Props extends React.ComponentProps<"g"> {
	/**
	 * Which mark to draw. Defaults to the one that suits the scale: a band on a
	 * bar chart, a line on a line chart.
	 */
	readonly variant?: "band" | "line";
}

/**
 * The mark under the reader's finger: a shaded band over the whole category on
 * a bar chart, a single line through it on a line chart. Drawn behind the marks
 * if you place it before them, which is usually what you want.
 */
export function ChartCursor({ className, variant, ...props }: Props) {
	const {
		active,
		categories,
		categoryScale,
		orientation,
		innerWidth,
		innerHeight,
	} = useChartContext();

	const category = active === null ? undefined : categories[active.index];
	if (category === undefined) {
		return null;
	}

	// A band scale has slots wide enough to shade; a point scale does not, so it
	// gets a line through the point instead.
	const shape = variant ?? (categoryScale.kind === "band" ? "band" : "line");
	const geometry: ChartCursorGeometry = {
		offset:
			shape === "band"
				? categoryScale.scale(category)
				: categoryScale.center(category),
		thickness: shape === "band" ? categoryScale.bandwidth : 0,
		innerWidth,
		innerHeight,
		orientation,
	};

	return (
		<g data-slot="chart-cursor" data-variant={shape} {...props}>
			{shape === "band" ? (
				<ChartCursorBand geometry={geometry} className={className} />
			) : (
				<ChartCursorLine geometry={geometry} className={className} />
			)}
		</g>
	);
}
