import type { ChartRendererProps } from "#/react/renderer.ts";
import { SvgSceneNodes } from "#/react/svg-scene.tsx";

/** The default renderer: the scene as inline SVG, server-renderable and crisp at any zoom. */
export function SvgRenderer({ scene, chartId }: ChartRendererProps) {
	return (
		<svg
			data-slot="chart-svg"
			aria-hidden="true"
			width={scene.width}
			height={scene.height}
			viewBox={`0 0 ${scene.width} ${scene.height}`}
			style={{ position: "absolute", inset: 0, overflow: "visible" }}
		>
			<SvgSceneNodes scene={scene} clipPrefix={chartId} />
		</svg>
	);
}
