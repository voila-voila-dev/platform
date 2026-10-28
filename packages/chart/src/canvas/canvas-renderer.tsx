import * as React from "react";
import { paintScene } from "#/canvas/paint-scene.ts";
import { createColorResolver, watchTheme } from "#/canvas/resolve-color.ts";
import type { ChartRendererProps } from "#/react/renderer.ts";

/**
 * Paints the scene onto a canvas: the renderer for thousands of marks, where
 * one DOM node per mark gets slow. Hit-testing, focus, the tooltip, the legend
 * and the data table do not change, they read the same scene. On the server
 * the canvas is empty and the data table carries the content until the first
 * paint.
 */
export function CanvasRenderer({ scene }: ChartRendererProps) {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const [themeVersion, setThemeVersion] = React.useState(0);

	React.useEffect(
		() => watchTheme(() => setThemeVersion((version) => version + 1)),
		[],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: a theme change repaints with fresh colours
	React.useLayoutEffect(() => {
		const canvas = canvasRef.current;
		const host = canvas?.parentElement;
		const context = canvas?.getContext("2d");
		if (!canvas || !host || !context) {
			return;
		}
		const ratio = window.devicePixelRatio || 1;
		canvas.width = Math.round(scene.width * ratio);
		canvas.height = Math.round(scene.height * ratio);
		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		const colors = createColorResolver(host);
		paintScene(
			context,
			scene,
			colors.resolve,
			getComputedStyle(host).fontFamily || "sans-serif",
		);
		colors.dispose();
	}, [scene, themeVersion]);

	return (
		<canvas
			ref={canvasRef}
			data-slot="chart-canvas"
			style={{
				position: "absolute",
				inset: 0,
				width: scene.width,
				height: scene.height,
			}}
		/>
	);
}
