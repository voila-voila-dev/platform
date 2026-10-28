import type { Easing } from "#/easing/types.ts";

function linear(progress: number): number {
	return progress;
}

/** One coordinate of the curve at parameter `t`, with P0 = 0 and P3 = 1. */
function coordinate(t: number, p1: number, p2: number): number {
	return ((1 - 3 * p2 + 3 * p1) * t + (3 * p2 - 6 * p1)) * t * t + 3 * p1 * t;
}

function slope(t: number, p1: number, p2: number): number {
	return 3 * (1 - 3 * p2 + 3 * p1) * t * t + 2 * (3 * p2 - 6 * p1) * t + 3 * p1;
}

/** The curve's parameter whose x is `x`: Newton first, bisection when the slope flattens. */
function solveT(x: number, x1: number, x2: number): number {
	let t = x;
	for (let iteration = 0; iteration < 8; iteration += 1) {
		const error = coordinate(t, x1, x2) - x;
		if (Math.abs(error) < 1e-7) {
			return t;
		}
		const derivative = slope(t, x1, x2);
		if (Math.abs(derivative) < 1e-6) {
			break;
		}
		t -= error / derivative;
	}
	let low = 0;
	let high = 1;
	t = x;
	for (let iteration = 0; iteration < 24; iteration += 1) {
		const value = coordinate(t, x1, x2);
		if (Math.abs(value - x) < 1e-7) {
			return t;
		}
		if (value < x) {
			low = t;
		} else {
			high = t;
		}
		t = (low + high) / 2;
	}
	return t;
}

/** CSS `cubic-bezier(x1, y1, x2, y2)` as a function. */
export function cubicBezier(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
): Easing {
	if (x1 === y1 && x2 === y2) {
		return linear;
	}
	return function bezier(progress) {
		if (progress <= 0 || progress >= 1) {
			return progress <= 0 ? 0 : 1;
		}
		return coordinate(solveT(progress, x1, x2), y1, y2);
	};
}
