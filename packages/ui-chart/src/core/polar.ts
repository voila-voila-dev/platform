import type { ChartPoint } from "#/core/types.ts";

/**
 * Polar helpers. Angles are **degrees, clockwise, zero at twelve o'clock** —
 * the way a pie chart is described out loud — rather than the mathematical
 * convention, so nothing in the components has to apply a mental offset.
 */

const FULL_TURN = 360;
const DEGREES_TO_RADIANS = Math.PI / 180;

export function polarToCartesian(
	cx: number,
	cy: number,
	radius: number,
	angle: number,
): ChartPoint {
	const radians = angle * DEGREES_TO_RADIANS;
	return {
		x: cx + radius * Math.sin(radians),
		y: cy - radius * Math.cos(radians),
	};
}

export interface PolarFrame {
	readonly cx: number;
	readonly cy: number;
	readonly radius: number;
}

/**
 * Where a round chart sits inside the root: centred in the plotting area, and
 * never wider than it. That is what makes the root's `margin` mean something
 * on a round chart — reserve space at the bottom for a legend and the circle
 * shrinks to leave it, rather than being drawn over it.
 */
export function polarFrame(options: {
	readonly innerWidth: number;
	readonly innerHeight: number;
	/** Pixels kept clear inside the plotting area, around the outer edge. */
	readonly inset?: number;
}): PolarFrame {
	const { innerWidth, innerHeight, inset = 0 } = options;
	return {
		cx: innerWidth / 2,
		cy: innerHeight / 2,
		radius: Math.max(0, Math.min(innerWidth, innerHeight) / 2 - inset),
	};
}

export interface ChartSliceAngle {
	readonly index: number;
	readonly value: number;
	/** Share of the total, in `[0, 1]`. Zero when every value is zero. */
	readonly fraction: number;
	readonly startAngle: number;
	readonly endAngle: number;
}

export interface SliceAngleOptions {
	readonly startAngle?: number;
	readonly endAngle?: number;
	/** Degrees of blank left between two neighbouring slices. */
	readonly padAngle?: number;
}

/**
 * Splits an angular span between values, proportionally. Negative values are
 * treated as zero: a pie of signed numbers has no honest reading, and silently
 * flipping a slice inside-out would be worse than showing nothing.
 */
export function sliceAngles(
	values: ReadonlyArray<number>,
	options: SliceAngleOptions = {},
): ReadonlyArray<ChartSliceAngle> {
	const { startAngle = 0, endAngle = FULL_TURN, padAngle = 0 } = options;
	const positives = values.map((value) =>
		Number.isFinite(value) && value > 0 ? value : 0,
	);
	const total = positives.reduce((sum, value) => sum + value, 0);
	const span = endAngle - startAngle;
	const available = Math.max(0, span - padAngle * positives.length);

	let cursor = startAngle;
	return positives.map((value, index) => {
		const fraction = total === 0 ? 0 : value / total;
		const sweep = available * fraction;
		const slice: ChartSliceAngle = {
			index,
			value: values[index],
			fraction,
			startAngle: cursor + padAngle / 2,
			endAngle: cursor + padAngle / 2 + sweep,
		};
		cursor += sweep + padAngle;
		return slice;
	});
}

/** The angle of the `index`-th of `count` axes, spread over a full turn. */
export function axisAngle(
	index: number,
	count: number,
	startAngle = 0,
): number {
	return count === 0 ? startAngle : startAngle + (FULL_TURN * index) / count;
}

/**
 * The vertices of one radar ring: `count` equally spaced points at `radius`.
 * Also used for the polar grid, whose rings are polygons rather than circles so
 * they line up with the data they frame.
 */
export function ringPoints(
	cx: number,
	cy: number,
	radius: number,
	count: number,
	startAngle = 0,
): ReadonlyArray<ChartPoint> {
	return Array.from({ length: count }, (_unused, index) =>
		polarToCartesian(cx, cy, radius, axisAngle(index, count, startAngle)),
	);
}

/**
 * Radii for `count` evenly spaced grid rings inside `radius`, outermost first.
 * The centre is never emitted — a ring of radius zero is a dot, not a ring.
 */
export function ringRadii(
	radius: number,
	count: number,
): ReadonlyArray<number> {
	return Array.from(
		{ length: Math.max(0, count) },
		(_unused, index) => (radius * (count - index)) / count,
	);
}
