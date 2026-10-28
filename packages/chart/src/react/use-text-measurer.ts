import * as React from "react";
import { estimateTextWidth } from "#/core/text.ts";
import type { ChartTextMeasurer } from "#/core/types.ts";

/**
 * Real text metrics once mounted. Until then, and on the server, the estimate
 * — the same on both sides, so hydration never sees a different layout. A web
 * font that finishes loading later triggers one more measure.
 */
export function useTextMeasurer(node: HTMLElement | null): ChartTextMeasurer {
	const [measurer, setMeasurer] = React.useState<ChartTextMeasurer>(
		() => estimateTextWidth,
	);

	React.useEffect(() => {
		if (node === null || typeof document === "undefined") {
			return;
		}
		const context = document.createElement("canvas").getContext("2d");
		if (context === null) {
			return;
		}
		function install() {
			if (node === null || context === null) {
				return;
			}
			const family = getComputedStyle(node).fontFamily || "sans-serif";
			const cache = new Map<string, number>();
			const measure: ChartTextMeasurer = (text, fontSize, fontWeight = 400) => {
				const key = `${fontWeight}:${fontSize}:${text}`;
				const cached = cache.get(key);
				if (cached !== undefined) {
					return cached;
				}
				context.font = `${fontWeight} ${fontSize}px ${family}`;
				const width = context.measureText(text).width;
				cache.set(key, width);
				return width;
			};
			setMeasurer(() => measure);
		}
		install();
		const fonts = document.fonts;
		fonts?.addEventListener?.("loadingdone", install);
		return () => fonts?.removeEventListener?.("loadingdone", install);
	}, [node]);

	return measurer;
}
