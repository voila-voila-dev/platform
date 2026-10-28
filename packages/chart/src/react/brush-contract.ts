import type * as React from "react";
import type {
	ChartPositionScale,
	ChartRect,
	ChartValue,
} from "#/core/types.ts";
import type { ChartMessages } from "#/react/messages.ts";

export type ChartBrushRange = readonly [ChartValue, ChartValue];

export interface ChartBrushLayerProps {
	readonly scale: ChartPositionScale;
	readonly plot: ChartRect;
	readonly range: ChartBrushRange | null;
	readonly messages: ChartMessages;
	readonly onChange: (range: ChartBrushRange | null) => void;
}

/**
 * What `brushX(…)` from `@voila.dev/chart/brush` returns. The chart only
 * knows this shape, so the brush's selection layer and sliders ship only
 * with the charts that use them.
 */
export interface ChartBrush {
	readonly onBrush: (range: ChartBrushRange | null) => void;
	readonly Layer: React.ComponentType<ChartBrushLayerProps>;
}

/** The two ends in the scale's own order. */
export function ordered(
	scale: ChartPositionScale,
	[a, b]: ChartBrushRange,
): ChartBrushRange {
	return scale.map(a) <= scale.map(b) ? [a, b] : [b, a];
}
