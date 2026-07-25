import * as React from "react";

import type {
	ChartDiscreteScale,
	ChartMargin,
	ChartOrientation,
} from "#/chart/core/types.ts";

/**
 * Turns pointer, touch and keyboard input over the plotting area into a single
 * "which datum is the reader looking at" index. One state, three input methods:
 * scrubbing with a finger, hovering with a mouse and arrowing with a keyboard
 * all land on the same active datum, so the tooltip and cursor never have to
 * care which one it was.
 */

/** Where the reader is, in plotting-area pixels. */
export interface ChartActive {
	readonly index: number;
	readonly x: number;
	readonly y: number;
}

export interface ChartPointerOptions {
	readonly enabled: boolean;
	readonly count: number;
	readonly width: number;
	readonly height: number;
	readonly margin: ChartMargin;
	readonly orientation: ChartOrientation;
	readonly categoryScale: ChartDiscreteScale;
}

export interface ChartPointerHandlers {
	readonly onPointerMove: React.PointerEventHandler<SVGSVGElement>;
	readonly onPointerDown: React.PointerEventHandler<SVGSVGElement>;
	readonly onPointerLeave: React.PointerEventHandler<SVGSVGElement>;
	readonly onKeyDown: React.KeyboardEventHandler<SVGSVGElement>;
	readonly onBlur: React.FocusEventHandler<SVGSVGElement>;
	readonly tabIndex: number | undefined;
}

export interface ChartPointerResult {
	readonly active: ChartActive | null;
	readonly setActive: React.Dispatch<React.SetStateAction<ChartActive | null>>;
	readonly handlers: ChartPointerHandlers;
}

/** Keyboard steps, keyed by the axis the categories run along. */
const KEY_STEPS: Record<ChartOrientation, Record<string, number>> = {
	vertical: { ArrowRight: 1, ArrowLeft: -1, ArrowUp: 1, ArrowDown: -1 },
	horizontal: { ArrowDown: 1, ArrowUp: -1, ArrowRight: 1, ArrowLeft: -1 },
};

/**
 * Converts a pointer event into plotting-area coordinates, correcting for any
 * scaling between the SVG's user units and its rendered box.
 */
function plotPoint(
	event: React.PointerEvent<SVGSVGElement>,
	options: ChartPointerOptions,
): { readonly x: number; readonly y: number } {
	const box = event.currentTarget.getBoundingClientRect();
	const scaleX = box.width === 0 ? 1 : options.width / box.width;
	const scaleY = box.height === 0 ? 1 : options.height / box.height;
	return {
		x: (event.clientX - box.left) * scaleX - options.margin.left,
		y: (event.clientY - box.top) * scaleY - options.margin.top,
	};
}

function activeFromPoint(
	point: { readonly x: number; readonly y: number },
	options: ChartPointerOptions,
): ChartActive {
	const along = options.orientation === "vertical" ? point.x : point.y;
	return { index: options.categoryScale.invert(along), ...point };
}

/** Places the active marker on a datum's own slot, for keyboard navigation. */
function activeFromIndex(
	index: number,
	options: ChartPointerOptions,
): ChartActive {
	const category = options.categoryScale.domain[index] ?? "";
	const center = options.categoryScale.center(category);
	return options.orientation === "vertical"
		? { index, x: center, y: 0 }
		: { index, x: 0, y: center };
}

export function useChartPointer(
	options: ChartPointerOptions,
): ChartPointerResult {
	const [active, setActive] = React.useState<ChartActive | null>(null);
	const { enabled, count, orientation } = options;

	// Built fresh every render rather than memoized: the handlers close over
	// scales that are themselves rebuilt whenever the geometry changes, and they
	// only ever land on a DOM element, where a stable identity buys nothing.
	const track = (event: React.PointerEvent<SVGSVGElement>) => {
		if (!enabled || count === 0) {
			return;
		}
		setActive(activeFromPoint(plotPoint(event, options), options));
	};

	const stepFrom = (delta: number): number => {
		const from = active?.index ?? null;
		if (from === null) {
			return delta > 0 ? 0 : count - 1;
		}
		return Math.min(Math.max(from + delta, 0), count - 1);
	};

	const targetIndexFor = (key: string): number | null => {
		if (key === "Home") {
			return 0;
		}
		if (key === "End") {
			return count - 1;
		}
		const delta = KEY_STEPS[orientation][key];
		return delta === undefined ? null : stepFrom(delta);
	};

	const handlers: ChartPointerHandlers = {
		tabIndex: enabled && count > 0 ? 0 : undefined,
		onPointerMove: track,
		// Touch fires no hover: the first contact has to select outright.
		onPointerDown: track,
		onPointerLeave: () => setActive(null),
		onBlur: () => setActive(null),
		onKeyDown: (event) => {
			if (!enabled || count === 0) {
				return;
			}
			if (event.key === "Escape") {
				setActive(null);
				return;
			}
			const target = targetIndexFor(event.key);
			if (target === null) {
				return;
			}
			event.preventDefault();
			setActive(activeFromIndex(target, options));
		},
	};

	return { active, setActive, handlers };
}
