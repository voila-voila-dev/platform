import { BrushLayer } from "#/brush/brush-layer.tsx";
import type { ChartBrush, ChartBrushRange } from "#/react/brush-contract.ts";

export type { ChartBrush, ChartBrushRange } from "#/react/brush-contract.ts";

/**
 * Select a range of x by dragging, or with two sliders from the keyboard.
 * Pass the result as `<Chart brush={…} />`.
 */
export function brushX(options: {
	readonly onBrush: (range: ChartBrushRange | null) => void;
}): ChartBrush {
	return { onBrush: options.onBrush, Layer: BrushLayer };
}
