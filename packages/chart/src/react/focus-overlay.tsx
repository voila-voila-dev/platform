import type * as React from "react";
import { arcPath, roundedBarPath } from "#/core/paths.ts";
import type { ChartPoint, ChartScene, ChartTheme } from "#/core/types.ts";
import type { ActiveFocus } from "#/react/use-chart-focus.ts";

const RING_RADIUS = 4.5;
const RING_OUTSET = 2;

function PointRing({
	point,
	keyboard,
	theme,
}: {
	point: ChartPoint;
	keyboard: boolean;
	theme: ChartTheme;
}) {
	const ring = keyboard ? "var(--ring, Highlight)" : theme.background;
	if (point.hit?.kind === "rect" && point.hit.rect.width > RING_RADIUS * 4) {
		if (!keyboard) {
			return null;
		}
		const { rect } = point.hit;
		return (
			<path
				data-slot="chart-focus-ring"
				d={roundedBarPath({
					x: rect.x - RING_OUTSET,
					y: rect.y - RING_OUTSET,
					width: rect.width + RING_OUTSET * 2,
					height: rect.height + RING_OUTSET * 2,
					radius: 4,
				})}
				fill="none"
				stroke={ring}
				strokeWidth={2}
			/>
		);
	}
	if (point.hit?.kind === "arc") {
		return (
			<path
				data-slot="chart-focus-ring"
				d={arcPath({
					...point.hit,
					outerRadius: point.hit.outerRadius + RING_OUTSET,
				})}
				fill="none"
				stroke={keyboard ? ring : theme.foreground}
				strokeWidth={2}
			/>
		);
	}
	return (
		<circle
			data-slot="chart-focus-ring"
			cx={point.x}
			cy={point.y}
			r={RING_RADIUS}
			fill={point.color}
			stroke={ring}
			strokeWidth={2}
		/>
	);
}

/**
 * The focus layer, drawn over the marks whichever renderer drew them: the
 * column or row band under the pointer, and a ring on the focused point.
 * Hidden from assistive tech: the live region says what it shows.
 */
export function FocusOverlay({
	scene,
	active,
	theme,
}: {
	scene: ChartScene;
	active: ActiveFocus | null;
	theme: ChartTheme;
}) {
	if (active === null) {
		return null;
	}
	const { plot, focusOrder, scales } = scene;
	const keyboard = active.source === "keyboard";
	const along = focusOrder === "y" ? scales.y : scales.x;
	const band = along?.kind === "band" ? along.bandwidth : 0;
	let cursor: React.ReactNode = null;
	if (focusOrder !== "point") {
		cursor =
			band > 0 ? (
				<rect
					data-slot="chart-cursor"
					{...(focusOrder === "y"
						? {
								x: plot.x,
								y: active.stop.at - band / 2,
								width: plot.width,
								height: band,
							}
						: {
								x: active.stop.at - band / 2,
								y: plot.y,
								width: band,
								height: plot.height,
							})}
					fill="currentColor"
					opacity={0.06}
				/>
			) : (
				<line
					data-slot="chart-cursor"
					{...(focusOrder === "y"
						? {
								x1: plot.x,
								x2: plot.x + plot.width,
								y1: active.stop.at,
								y2: active.stop.at,
							}
						: {
								x1: active.stop.at,
								x2: active.stop.at,
								y1: plot.y,
								y2: plot.y + plot.height,
							})}
					stroke={theme.muted}
					strokeWidth={1}
					strokeDasharray="3 3"
				/>
			);
	}
	const ringed =
		focusOrder === "point" || (keyboard && active.stop.points.length > 1)
			? [active.point]
			: active.stop.points;
	return (
		<svg
			aria-hidden="true"
			data-slot="chart-focus"
			width={scene.width}
			height={scene.height}
			style={{
				position: "absolute",
				inset: 0,
				overflow: "visible",
				pointerEvents: "none",
			}}
		>
			{cursor}
			{ringed.map((point) => (
				<PointRing
					key={point.key}
					point={point}
					keyboard={keyboard}
					theme={theme}
				/>
			))}
		</svg>
	);
}
