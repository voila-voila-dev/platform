import * as React from "react";

/**
 * The container's width. The server and the first client render use
 * `initialWidth`, so the hydrated markup matches; the real width arrives on
 * the first observer callback.
 */
export function useChartWidth(initialWidth: number) {
	const [node, setNode] = React.useState<HTMLDivElement | null>(null);
	const [width, setWidth] = React.useState(initialWidth);

	React.useEffect(() => {
		if (node === null || typeof ResizeObserver === "undefined") {
			return;
		}
		const observer = new ResizeObserver((entries) => {
			const measured = entries[0]?.contentRect.width;
			if (measured !== undefined && measured > 0) {
				setWidth(Math.round(measured));
			}
		});
		observer.observe(node);
		return () => observer.disconnect();
	}, [node]);

	return { ref: setNode, width, node };
}
