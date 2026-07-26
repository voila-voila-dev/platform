import type { ChartCursorGeometry } from "#/chart/core/types.ts";
import { cn } from "#/lib/utils.ts";

interface Props {
	readonly geometry: ChartCursorGeometry;
	readonly className: string | undefined;
}

/** Shades the whole category slot — the band-scale half of `ChartCursor`. */
export function ChartCursorBand({ geometry, className }: Props) {
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
