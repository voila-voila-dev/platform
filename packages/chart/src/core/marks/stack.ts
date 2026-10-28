/**
 * Stacking: each value sits on the running total of the values before it at
 * the same position. Positives grow away from zero upwards and negatives
 * downwards, separately, so a stack of mixed signs never overlaps itself.
 */

export interface StackSegment {
	readonly low: number;
	readonly high: number;
	/** The outermost segment of its side of the stack: the one whose far end gets rounded. */
	readonly outer: boolean;
}

export function stackSegments(
	positions: ReadonlyArray<string | undefined>,
	values: ReadonlyArray<number | undefined>,
): ReadonlyArray<StackSegment | undefined> {
	const above = new Map<string, number>();
	const below = new Map<string, number>();
	const lastAbove = new Map<string, number>();
	const lastBelow = new Map<string, number>();
	const segments: Array<
		{ low: number; high: number; outer: boolean } | undefined
	> = positions.map((position, index) => {
		const value = values[index];
		if (position === undefined || value === undefined) {
			return undefined;
		}
		const totals = value >= 0 ? above : below;
		const base = totals.get(position) ?? 0;
		totals.set(position, base + value);
		(value >= 0 ? lastAbove : lastBelow).set(position, index);
		return { low: base, high: base + value, outer: false };
	});
	for (const index of [...lastAbove.values(), ...lastBelow.values()]) {
		const segment = segments[index];
		if (segment !== undefined) {
			segment.outer = true;
		}
	}
	return segments;
}
