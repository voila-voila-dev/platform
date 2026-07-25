import * as React from "react";

/**
 * Measures the element the returned `ref` is attached to. Charts are drawn in
 * pixels, so every scale needs a real width and height before it can place
 * anything.
 *
 * Server-safe: nothing is read from the document during render, and the first
 * paint uses `initial` so a chart rendered on the server still has sensible
 * geometry. The real size arrives on the first observer callback.
 */

const DEFAULT_DIMENSION = { width: 320, height: 200 } as const;

export interface ChartDimension {
	readonly width: number;
	readonly height: number;
}

export interface ChartDimensionsResult extends ChartDimension {
	readonly ref: (node: HTMLDivElement | null) => void;
}

export function useChartDimensions(
	initial: ChartDimension = DEFAULT_DIMENSION,
): ChartDimensionsResult {
	const [node, setNode] = React.useState<HTMLDivElement | null>(null);
	const [dimension, setDimension] = React.useState<ChartDimension>(initial);

	React.useEffect(() => {
		if (node === null || typeof ResizeObserver === "undefined") {
			return;
		}
		const observer = new ResizeObserver((entries) => {
			const box = entries[0]?.contentRect;
			if (box === undefined || box.width === 0 || box.height === 0) {
				return;
			}
			setDimension((current) =>
				current.width === box.width && current.height === box.height
					? current
					: { width: box.width, height: box.height },
			);
		});
		observer.observe(node);
		return () => observer.disconnect();
	}, [node]);

	return { ref: setNode, width: dimension.width, height: dimension.height };
}
