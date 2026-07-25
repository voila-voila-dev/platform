import { readNumber } from "#/chart/core/chart-model.ts";
import type {
	ChartDatum,
	ChartDiscreteScale,
	ChartLinearScale,
	ChartOrientation,
} from "#/chart/core/types.ts";

/**
 * Bar geometry, worked out away from React so it can be asserted on directly.
 * Covers the four combinations that matter: grouped or stacked, upright or on
 * its side, with values that may go either side of the baseline.
 */

export interface BarRect {
	readonly key: string;
	/** Index of the datum, i.e. of the category slot. */
	readonly index: number;
	readonly value: number;
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
	readonly radius: readonly [number, number, number, number];
}

export interface BarLayoutOptions {
	readonly data: ReadonlyArray<ChartDatum>;
	readonly keys: ReadonlyArray<string>;
	readonly categories: ReadonlyArray<string>;
	readonly categoryScale: ChartDiscreteScale;
	readonly valueScale: ChartLinearScale;
	readonly orientation: ChartOrientation;
	readonly stacked?: boolean;
	readonly radius?: number;
	/** Pixels left between two bars of the same group. */
	readonly gap?: number;
}

const DEFAULT_GAP = 2;

/**
 * Corner radii for the end of a bar that points away from the baseline. The
 * other end stays square so it meets the axis, or the next stack segment,
 * cleanly.
 */
function endRadius(
	radius: number,
	orientation: ChartOrientation,
	isPositive: boolean,
): readonly [number, number, number, number] {
	if (orientation === "vertical") {
		return isPositive ? [radius, radius, 0, 0] : [0, 0, radius, radius];
	}
	return isPositive ? [0, radius, radius, 0] : [radius, 0, 0, radius];
}

/** The last key on each side of the baseline — the only segments that round. */
function outerKeys(
	datum: ChartDatum,
	keys: ReadonlyArray<string>,
): { readonly positive: string | null; readonly negative: string | null } {
	let positive: string | null = null;
	let negative: string | null = null;
	for (const key of keys) {
		const value = readNumber(datum, key);
		if (value > 0) {
			positive = key;
		} else if (value < 0) {
			negative = key;
		}
	}
	return { positive, negative };
}

function rectFor(
	options: BarLayoutOptions,
	placement: {
		readonly key: string;
		readonly index: number;
		readonly value: number;
		readonly slotStart: number;
		readonly slotSize: number;
		readonly from: number;
		readonly to: number;
		readonly radius: readonly [number, number, number, number];
	},
): BarRect {
	const { key, index, value, slotStart, slotSize, from, to, radius } =
		placement;
	const low = Math.min(from, to);
	const span = Math.abs(from - to);
	const common = { key, index, value, radius };
	return options.orientation === "vertical"
		? { ...common, x: slotStart, y: low, width: slotSize, height: span }
		: { ...common, x: low, y: slotStart, width: span, height: slotSize };
}

export function barRects(options: BarLayoutOptions): ReadonlyArray<BarRect> {
	const {
		data,
		keys,
		categories,
		categoryScale,
		valueScale,
		orientation,
		stacked = false,
		radius = 0,
		gap = DEFAULT_GAP,
	} = options;

	const slotWidth = categoryScale.bandwidth;
	const lanes = stacked ? 1 : Math.max(1, keys.length);
	const lane = slotWidth / lanes;
	const barSize = stacked ? slotWidth : Math.max(0, lane - gap);
	const baseline = valueScale.scale(0);

	return data.flatMap((datum, index) => {
		const slotOrigin = categoryScale.scale(categories[index] ?? String(index));
		const outer = outerKeys(datum, keys);
		let positiveTop = 0;
		let negativeTop = 0;

		return keys.map((key, laneIndex) => {
			const value = readNumber(datum, key);
			const isPositive = value >= 0;

			let from = baseline;
			let to = valueScale.scale(value);
			if (stacked) {
				const base = isPositive ? positiveTop : negativeTop;
				const top = base + value;
				from = valueScale.scale(base);
				to = valueScale.scale(top);
				if (isPositive) {
					positiveTop = top;
				} else {
					negativeTop = top;
				}
			}

			const rounds =
				!stacked || key === (isPositive ? outer.positive : outer.negative);

			return rectFor(options, {
				key,
				index,
				value,
				slotStart:
					slotOrigin + (stacked ? 0 : laneIndex * lane + (lane - barSize) / 2),
				slotSize: barSize,
				from,
				to,
				radius: rounds
					? endRadius(radius, orientation, isPositive)
					: [0, 0, 0, 0],
			});
		});
	});
}
