import type * as React from "react";
import { createPortal } from "react-dom";
import { ChartLegendContent } from "#/chart/components/chart-legend-content.tsx";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { cn } from "#/lib/utils.ts";

// `content` is omitted from the base: React declares it on every element as
// the `<meta content>` string.
interface Props extends Omit<React.ComponentProps<"div">, "content"> {
	content?: React.ReactNode;
	align?: "top" | "bottom";
}

/**
 * The colour key. Portals into the root's overlay layer, so it composes inside
 * `Chart.Root` like every other part while still being ordinary HTML — leave
 * room for it in the root's `margin`.
 */
export function ChartLegend({
	content,
	align = "bottom",
	className,
	...props
}: Props) {
	const { overlay } = useChartContext();
	if (overlay === null) {
		return null;
	}

	return createPortal(
		<div
			data-slot="chart-legend"
			data-align={align}
			className={cn(
				"pointer-events-auto absolute inset-x-0",
				align === "top" ? "top-0" : "bottom-0",
				className,
			)}
			{...props}
		>
			{content ?? <ChartLegendContent />}
		</div>,
		overlay,
	);
}
