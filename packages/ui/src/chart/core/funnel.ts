/**
 * Funnel geometry, worked out away from React so it can be asserted on
 * directly. One slice per step: a horizontal band whose left edge is as tall
 * as the step's value and whose right edge slopes down to the next step's
 * value, so the drop between two steps is visible as the flank itself.
 */

export interface FunnelSlice {
	/** Index of the datum, i.e. of the category slot. */
	readonly index: number;
	readonly value: number;
	/** Left edge of the band, in plot coordinates. */
	readonly x: number;
	readonly width: number;
	/** Height of the left flank, proportional to the step's value. */
	readonly leftHeight: number;
	/** Height of the right flank — the next step's value, or its own on the last step. */
	readonly rightHeight: number;
	/** The trapezoid, vertically centred on the band. `""` when there is nothing to draw. */
	readonly path: string;
	/** Conversion into the next step. `null` on the last step or when this one is empty. */
	readonly ratioToNext: number | null;
}

export interface FunnelLayoutOptions {
	readonly values: ReadonlyArray<number>;
	readonly innerWidth: number;
	readonly innerHeight: number;
	/** Pixels of blank between two bands. */
	readonly gap?: number;
	/** Vertical centre line of the funnel. Defaults to half the inner height. */
	readonly centerY?: number;
	/** Height the largest value maps to. Defaults to the inner height. */
	readonly maxHeight?: number;
}

const DEFAULT_GAP = 4;
const PATH_PRECISION = 2;

function round(value: number): number {
	const factor = 10 ** PATH_PRECISION;
	return Math.round(value * factor) / factor;
}

function point(x: number, y: number): string {
	return `${round(x)},${round(y)}`;
}

function trapezoidPath(
	x: number,
	width: number,
	centerY: number,
	leftHeight: number,
	rightHeight: number,
): string {
	if (width <= 0 || (leftHeight <= 0 && rightHeight <= 0)) {
		return "";
	}
	const right = x + width;
	return [
		`M${point(x, centerY - leftHeight / 2)}`,
		`L${point(right, centerY - rightHeight / 2)}`,
		`L${point(right, centerY + rightHeight / 2)}`,
		`L${point(x, centerY + leftHeight / 2)}`,
		"Z",
	].join("");
}

export function funnelSlices(
	options: FunnelLayoutOptions,
): ReadonlyArray<FunnelSlice> {
	const {
		values,
		innerWidth,
		innerHeight,
		gap = DEFAULT_GAP,
		centerY = innerHeight / 2,
		maxHeight = innerHeight,
	} = options;

	const count = values.length;
	if (count === 0 || innerWidth <= 0 || maxHeight <= 0) {
		return [];
	}

	const clamped = values.map((value) => Math.max(0, value));
	const peak = Math.max(...clamped);
	const heightFor = (value: number): number =>
		peak <= 0 ? 0 : (value / peak) * maxHeight;

	const bandWidth = Math.max(0, (innerWidth - gap * (count - 1)) / count);

	return clamped.map((value, index) => {
		const next = clamped[index + 1];
		const leftHeight = heightFor(value);
		// The last band has no next step to taper into, so it stays a rectangle.
		const rightHeight = next === undefined ? leftHeight : heightFor(next);
		const x = index * (bandWidth + gap);
		return {
			index,
			value: values[index],
			x,
			width: bandWidth,
			leftHeight,
			rightHeight,
			path: trapezoidPath(x, bandWidth, centerY, leftHeight, rightHeight),
			ratioToNext: next === undefined || value <= 0 ? null : next / value,
		};
	});
}
