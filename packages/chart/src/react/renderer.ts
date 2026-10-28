import type * as React from "react";
import type { ChartScene } from "#/core/types.ts";

/**
 * What draws the scene. The SVG renderer is the default; `@voila.dev/chart/canvas`
 * exports one that paints the same scene onto a canvas, for thousands of marks.
 * Either way the focus ring, tooltip, legend and data table are the same.
 */
export interface ChartRendererProps {
	readonly scene: ChartScene;
	/** Unique per chart, for clip-path ids. */
	readonly chartId: string;
}

export type ChartRenderer = React.ComponentType<ChartRendererProps>;
