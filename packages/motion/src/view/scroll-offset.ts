/**
 * Where a scroll animation starts and ends, as Motion writes it: each offset
 * is "<target edge> <container edge>", the scroll position at which that
 * point of the target meets that point of the scrollport. "start end" is the
 * target's top touching the viewport's bottom.
 */
export type ScrollEdge =
	| "start"
	| "center"
	| "end"
	| number
	| `${number}px`
	| `${number}%`;

export type ScrollOffsetPoint =
	| `${string} ${string}`
	| readonly [ScrollEdge, ScrollEdge];

export type ScrollOffset = readonly [ScrollOffsetPoint, ScrollOffsetPoint];

/** The target crossing the scrollport, from first pixel in to last pixel out. */
export const ENTER_TO_EXIT: ScrollOffset = ["start end", "end start"];
/** The whole scroll range, when there is no target. */
export const FULL_RANGE: ScrollOffset = ["start start", "end end"];

const NAMED_EDGES: Readonly<Record<string, number>> = {
	start: 0,
	center: 0.5,
	end: 1,
};

/** An edge as pixels along a length: named and bare numbers are fractions. */
export function resolveEdge(edge: ScrollEdge, length: number): number {
	if (typeof edge === "number") {
		return edge * length;
	}
	const named = NAMED_EDGES[edge];
	if (named !== undefined) {
		return named * length;
	}
	const value = Number.parseFloat(edge);
	if (Number.isNaN(value)) {
		throw new Error(`Unknown scroll edge: ${edge}`);
	}
	if (edge.endsWith("%")) {
		return (value / 100) * length;
	}
	return edge.endsWith("px") ? value : value * length;
}

export function parseOffsetPoint(
	point: ScrollOffsetPoint,
): readonly [ScrollEdge, ScrollEdge] {
	if (typeof point !== "string") {
		return point;
	}
	const [target, container = target] = point.trim().split(/\s+/);
	return [parseEdge(target), parseEdge(container)];
}

function parseEdge(text: string): ScrollEdge {
	return text in NAMED_EDGES || /[a-z%]$/.test(text)
		? (text as ScrollEdge)
		: Number(text);
}

export interface ScrollGeometry {
	/** The target's start along the axis, in the container's content coordinates. */
	readonly targetStart: number;
	readonly targetLength: number;
	/** The scrollport's visible length. */
	readonly viewportLength: number;
}

/** The scroll position at which one offset point is reached. */
export function offsetPosition(
	point: ScrollOffsetPoint,
	geometry: ScrollGeometry,
): number {
	const [target, container] = parseOffsetPoint(point);
	return (
		geometry.targetStart +
		resolveEdge(target, geometry.targetLength) -
		resolveEdge(container, geometry.viewportLength)
	);
}

/** Progress 0..1 of `scroll` between the two offsets, clamped. */
export function scrollProgress(
	scroll: number,
	offset: ScrollOffset,
	geometry: ScrollGeometry,
): number {
	const from = offsetPosition(offset[0], geometry);
	const to = offsetPosition(offset[1], geometry);
	if (to === from) {
		return scroll >= to ? 1 : 0;
	}
	return Math.min(1, Math.max(0, (scroll - from) / (to - from)));
}
