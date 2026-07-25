import type * as React from "react";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import type { ChartOrientation } from "#/chart/core/types.ts";
import { cn } from "#/lib/utils.ts";

/**
 * The mark under the reader's finger: a shaded band over the whole category on
 * a bar chart, a single line through it on a line chart. Drawn behind the marks
 * if you place it before them, which is usually what you want.
 */

export interface ChartCursorProps extends React.ComponentProps<"g"> {
	readonly variant?: "band" | "line";
}

/** Where the cursor sits and how far it reaches, in plotting-area pixels. */
interface CursorGeometry {
	readonly offset: number;
	readonly thickness: number;
	readonly innerWidth: number;
	readonly innerHeight: number;
	readonly orientation: ChartOrientation;
}

function CursorBand({
	geometry,
	className,
}: {
	readonly geometry: CursorGeometry;
	readonly className: string | undefined;
}) {
	const isVertical = geometry.orientation === "vertical";
	return (
		<rect
			x={isVertical ? geometry.offset : 0}
			y={isVertical ? 0 : geometry.offset}
			width={isVertical ? geometry.thickness : geometry.innerWidth}
			height={isVertical ? geometry.innerHeight : geometry.thickness}
			className={cn("fill-muted/60", className)}
		/>
	);
}

function CursorLine({
	geometry,
	className,
}: {
	readonly geometry: CursorGeometry;
	readonly className: string | undefined;
}) {
	const isVertical = geometry.orientation === "vertical";
	return (
		<line
			x1={isVertical ? geometry.offset : 0}
			x2={isVertical ? geometry.offset : geometry.innerWidth}
			y1={isVertical ? 0 : geometry.offset}
			y2={isVertical ? geometry.innerHeight : geometry.offset}
			strokeDasharray="4 4"
			className={cn("stroke-border", className)}
		/>
	);
}

function ChartCursor({ className, variant, ...props }: ChartCursorProps) {
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
	const geometry: CursorGeometry = {
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
				<CursorBand geometry={geometry} className={className} />
			) : (
				<CursorLine geometry={geometry} className={className} />
			)}
		</g>
	);
}

export { ChartCursor };
