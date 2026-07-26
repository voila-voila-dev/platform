import type * as React from "react";
import { createPortal } from "react-dom";
import { ChartTooltipContent } from "#/chart/components/chart-tooltip-content.tsx";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { cn } from "#/lib/utils.ts";

// `content` is omitted from the base: React declares it on every element as
// the `<meta content>` string.
interface Props extends Omit<React.ComponentProps<"div">, "content"> {
	/** Replaces the default body. */
	content?: React.ReactNode;
	/** Pixels between the pointer and the panel. */
	offset?: number;
}

/** Room the panel needs above the pointer before it stops flipping upwards. */
const PANEL_HEIGHT = 88;
/** Nominal half-width, used to keep the panel's edges on screen. */
const HALF_PANEL = 72;

/** Keeps the panel inside the given bounds rather than letting it hang off. */
function clamp(value: number, low: number, high: number): number {
	return Math.min(Math.max(value, low), high);
}

/**
 * The readout for the active datum. `ChartTooltip` places it; the content is a
 * separate component so a caller can replace the body without reimplementing
 * the positioning, which is the fiddly half.
 */
export function ChartTooltip({
	content,
	offset = 12,
	className,
	...props
}: Props) {
	const { active, chartId, margin, overlay } = useChartContext();

	if (active === null || overlay === null) {
		return null;
	}

	// Positioned against the viewport and portalled to the document, not to the
	// chart's own overlay: a sparkline inside a card is both tiny and clipped by
	// `overflow-hidden`, and a readout the card cuts in half is worse than none.
	const box = overlay.getBoundingClientRect();
	const view = overlay.ownerDocument.defaultView;
	const viewportWidth = view?.innerWidth ?? box.right;
	const viewportHeight = view?.innerHeight ?? box.bottom;

	const anchorX = box.left + margin.left + active.x;
	const anchorY = box.top + margin.top + active.y;

	// The panel sits above the reader's finger, where it does not hide what is
	// being pointed at — unless the top of the window is in the way.
	const above = anchorY - PANEL_HEIGHT > 0;
	const left = clamp(anchorX, HALF_PANEL, viewportWidth - HALF_PANEL);
	const top = clamp(anchorY + (above ? -offset : offset), 0, viewportHeight);

	return createPortal(
		<div
			data-slot="chart-tooltip"
			// The `--color-<key>` variables are scoped to `[data-chart=<id>]`, and
			// the panel no longer lives inside the chart. Carrying the id onto it
			// keeps the series colours resolvable from the document body.
			data-chart={chartId}
			data-placement={above ? "above" : "below"}
			className={cn(
				"pointer-events-none fixed z-50 -translate-x-1/2",
				above && "-translate-y-full",
				className,
			)}
			style={{ left, top }}
			{...props}
		>
			{content ?? <ChartTooltipContent />}
		</div>,
		overlay.ownerDocument.body,
	);
}
