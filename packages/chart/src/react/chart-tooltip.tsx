import type * as React from "react";
import type { ChartScene } from "#/core/types.ts";
import type { ActiveFocus } from "#/react/use-chart-focus.ts";

const OFFSET = 12;
const MAX_WIDTH = 280;

export interface ChartTooltipRenderProps {
	readonly active: ActiveFocus;
	readonly scene: ChartScene;
}

const SURFACE: React.CSSProperties = {
	position: "absolute",
	top: 0,
	left: 0,
	pointerEvents: "none",
	zIndex: 1,
	maxWidth: MAX_WIDTH,
	padding: "6px 10px",
	borderRadius: 8,
	border:
		"1px solid var(--border, color-mix(in oklab, currentColor 15%, transparent))",
	background: "var(--popover, Canvas)",
	color: "var(--popover-foreground, CanvasText)",
	boxShadow: "0 4px 16px rgb(0 0 0 / 0.08)",
	fontSize: 12,
	lineHeight: 1.4,
	whiteSpace: "nowrap",
};

/** The default content: the stop's title, then one row per series with its swatch. */
export function ChartTooltipContent({
	active,
	scene,
}: ChartTooltipRenderProps) {
	const rows =
		active.stop.points.length > 1 ? active.stop.points : [active.point];
	return (
		<>
			<div style={{ fontWeight: 600, marginBottom: 2 }}>
				{active.point.title}
			</div>
			{rows.map((point) => (
				<div
					key={point.key}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 6,
						fontWeight:
							point.key === active.point.key && rows.length > 1 ? 600 : 400,
					}}
				>
					<span
						aria-hidden="true"
						style={{
							width: 8,
							height: 8,
							borderRadius: 2,
							background: point.color,
							flex: "none",
						}}
					/>
					<span style={{ color: "var(--muted-foreground, inherit)" }}>
						{point.seriesLabel ?? scene.yLabel}
					</span>
					<span
						style={{
							marginLeft: "auto",
							paddingLeft: 12,
							fontVariantNumeric: "tabular-nums",
						}}
					>
						{point.value}
					</span>
				</div>
			))}
		</>
	);
}

/**
 * Follows the focused stop, on the side with room. Hidden from assistive
 * tech: the live region already says the same thing once, where this would
 * say it on every pointer move.
 */
export function ChartTooltip({
	active,
	scene,
	render,
}: ChartTooltipRenderProps & {
	render: (props: ChartTooltipRenderProps) => React.ReactNode;
}) {
	const anchorX = scene.focusOrder === "x" ? active.stop.at : active.point.x;
	const anchorY = Math.min(...active.stop.points.map((point) => point.y));
	const flip = anchorX > scene.width / 2;
	return (
		<div
			aria-hidden="true"
			data-slot="chart-tooltip"
			data-pinned={active.pinned ? "" : undefined}
			style={{
				...SURFACE,
				transform: `translate(${flip ? `calc(${anchorX - OFFSET}px - 100%)` : `${anchorX + OFFSET}px`}, ${Math.max(0, anchorY - OFFSET)}px)`,
			}}
		>
			{render({ active, scene })}
		</div>
	);
}
