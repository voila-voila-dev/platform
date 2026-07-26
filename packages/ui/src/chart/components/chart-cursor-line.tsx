import type { ChartCursorGeometry } from "#/chart/core/types.ts";
import { cn } from "#/lib/utils.ts";

interface Props {
	readonly geometry: ChartCursorGeometry;
	readonly className: string | undefined;
}

/** Rules through the active point — the point-scale half of `ChartCursor`. */
export function ChartCursorLine({ geometry, className }: Props) {
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
