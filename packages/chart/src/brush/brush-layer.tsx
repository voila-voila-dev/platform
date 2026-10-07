import type * as React from "react";
import type { ChartPositionScale, ChartValue } from "#/core/types.ts";
import {
	type ChartBrushLayerProps,
	type ChartBrushRange,
	ordered,
} from "#/react/brush-contract.ts";

function isDiscrete(scale: ChartPositionScale): boolean {
	return scale.kind === "band" || scale.kind === "point";
}

function numeric(value: ChartValue): number {
	return value instanceof Date ? value.getTime() : Number(value);
}

/** The pixel extent of a selection: whole bands on a band scale. */
export function brushPixels(
	scale: ChartPositionScale,
	[from, to]: ChartBrushRange,
): readonly [number, number] {
	const left = Math.min(scale.map(from), scale.map(to));
	const right = Math.max(scale.map(from), scale.map(to)) + scale.bandwidth;
	return [left, right];
}

/** One keyboard step along the scale: a category, or a fiftieth of the domain. */
export function stepValue(
	scale: ChartPositionScale,
	value: ChartValue,
	direction: 1 | -1,
	large: boolean,
): ChartValue {
	if (isDiscrete(scale)) {
		const index = scale.domain.findIndex(
			(candidate) =>
				numeric(candidate) === numeric(value) || candidate === value,
		);
		const next = Math.min(
			scale.domain.length - 1,
			Math.max(0, index + direction * (large ? 5 : 1)),
		);
		return scale.domain[next];
	}
	const [low, high] = scale.domain.map(numeric);
	const step = ((high - low) / 50) * (large ? 5 : 1);
	const next = Math.min(high, Math.max(low, numeric(value) + direction * step));
	return scale.kind === "time" ? new Date(next) : next;
}

const HANDLE_WIDTH = 8;

/**
 * The selection over the plot, and its two ends as sliders. The sliders sit
 * outside the chart's graphic (whose children assistive tech does not see),
 * so a keyboard or screen-reader user can set a range as well as a mouse
 * can: arrows move an end, Page keys move it five steps, Home and End jump,
 * Escape clears.
 */
export function BrushLayer({
	scale,
	plot,
	range,
	messages,
	onChange,
}: ChartBrushLayerProps) {
	const ends = range ?? [
		scale.domain[0],
		scale.domain[scale.domain.length - 1],
	];
	const [left, right] = range
		? brushPixels(scale, range)
		: [plot.x, plot.x + plot.width];

	function handleKey(which: 0 | 1) {
		return (event: React.KeyboardEvent<HTMLDivElement>) => {
			const current = ends[which];
			let next: ChartValue | undefined;
			if (event.key === "ArrowRight" || event.key === "ArrowUp")
				next = stepValue(scale, current, 1, false);
			if (event.key === "ArrowLeft" || event.key === "ArrowDown")
				next = stepValue(scale, current, -1, false);
			if (event.key === "PageUp") next = stepValue(scale, current, 1, true);
			if (event.key === "PageDown") next = stepValue(scale, current, -1, true);
			if (event.key === "Home") next = scale.domain[0];
			if (event.key === "End") next = scale.domain[scale.domain.length - 1];
			if (event.key === "Escape") {
				event.preventDefault();
				onChange(null);
				return;
			}
			if (next === undefined) return;
			event.preventDefault();
			const updated: [ChartValue, ChartValue] = [ends[0], ends[1]];
			updated[which] = next;
			onChange(ordered(scale, updated));
		};
	}

	const [low, high] = isDiscrete(scale)
		? [0, scale.domain.length - 1]
		: scale.domain.map(numeric);
	const position = (value: ChartValue) =>
		isDiscrete(scale)
			? scale.domain.findIndex(
					(candidate) =>
						candidate === value || numeric(candidate) === numeric(value),
				)
			: numeric(value);

	return (
		<>
			{range ? (
				<div
					aria-hidden="true"
					data-slot="chart-brush-selection"
					style={{
						position: "absolute",
						left,
						top: plot.y,
						width: Math.max(0, right - left),
						height: plot.height,
						background: "color-mix(in oklab, currentColor 10%, transparent)",
						borderInline:
							"1px solid color-mix(in oklab, currentColor 40%, transparent)",
						pointerEvents: "none",
					}}
				/>
			) : null}
			{([0, 1] as const).map((which) => (
				<div
					key={which}
					role="slider"
					tabIndex={0}
					aria-label={which === 0 ? messages.brushStart : messages.brushEnd}
					aria-valuemin={low}
					aria-valuemax={high}
					aria-valuenow={position(ends[which])}
					aria-valuetext={scale.format(ends[which])}
					aria-orientation="horizontal"
					data-slot="chart-brush-handle"
					onKeyDown={handleKey(which)}
					onPointerDown={(event) =>
						event.currentTarget.setPointerCapture(event.pointerId)
					}
					onPointerMove={(event) => {
						if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
						const frame =
							event.currentTarget.parentElement?.getBoundingClientRect();
						if (frame === undefined) return;
						const updated: [ChartValue, ChartValue] = [ends[0], ends[1]];
						updated[which] = scale.invert(event.clientX - frame.left);
						onChange(ordered(scale, updated));
					}}
					style={{
						position: "absolute",
						left: (which === 0 ? left : right) - HANDLE_WIDTH / 2,
						top: plot.y + plot.height / 2 - 14,
						width: HANDLE_WIDTH,
						height: 28,
						borderRadius: 4,
						background: "var(--background, Canvas)",
						border:
							"1px solid color-mix(in oklab, currentColor 50%, transparent)",
						cursor: "ew-resize",
						userSelect: "none",
						WebkitUserSelect: "none",
						opacity: range ? 1 : 0.5,
					}}
				/>
			))}
		</>
	);
}
