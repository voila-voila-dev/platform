/**
 * Round tick values for a continuous axis. The step is always 1, 2, 5 or 10
 * times a power of ten, which is what makes an axis readable: 0/25/50/75/100
 * rather than 0/23.4/46.8.
 */

/** Steps the eye reads as round, in units of the current power of ten. */
const NICE_FACTORS = [
	{ threshold: Math.SQRT2, factor: 1 },
	{ threshold: Math.sqrt(10), factor: 2 },
	{ threshold: Math.sqrt(50), factor: 5 },
] as const;

const DEFAULT_TICK_COUNT = 5;
/** Beyond this many decimals the rounding helper stops fighting IEEE noise. */
const MAX_TICK_PRECISION = 12;

/**
 * Drops the floating-point dust `i * step` leaves behind (0.30000000000000004)
 * by rounding to the number of decimals the step itself carries.
 */
function roundToStep(value: number, step: number): number {
	if (step === 0 || !Number.isFinite(step)) {
		return value;
	}
	const decimals = Math.max(0, -Math.floor(Math.log10(Math.abs(step))));
	return Number(value.toFixed(Math.min(decimals, MAX_TICK_PRECISION)));
}

/**
 * The round step closest to covering `[min, max]` in about `count` intervals.
 * Returns `0` for a degenerate span, which callers read as "no ticks".
 */
export function tickStep(
	min: number,
	max: number,
	count: number = DEFAULT_TICK_COUNT,
): number {
	const span = max - min;
	if (!Number.isFinite(span) || span <= 0 || count <= 0) {
		return 0;
	}
	const rough = span / count;
	const power = Math.floor(Math.log10(rough));
	const error = rough / 10 ** power;
	const match = NICE_FACTORS.find((candidate) => error < candidate.threshold);
	return (match?.factor ?? 10) * 10 ** power;
}

/**
 * Round values strictly inside `[min, max]`. An axis that has been through
 * `niceDomain` first gets ticks on both bounds; a raw domain does not, on
 * purpose — a tick outside the data would be a lie.
 */
export function niceTicks(
	min: number,
	max: number,
	count: number = DEFAULT_TICK_COUNT,
): ReadonlyArray<number> {
	if (min === max) {
		return [min];
	}
	const step = tickStep(min, max, count);
	if (step === 0) {
		return [];
	}
	const first = Math.ceil(min / step);
	const last = Math.floor(max / step);
	const ticks: number[] = [];
	for (let index = first; index <= last; index += 1) {
		ticks.push(roundToStep(index * step, step));
	}
	return ticks;
}

/**
 * Widens `[min, max]` outwards to the nearest round step, so the axis starts
 * and ends on a tick instead of mid-air.
 */
export function niceDomain(
	min: number,
	max: number,
	count: number = DEFAULT_TICK_COUNT,
): readonly [number, number] {
	if (!Number.isFinite(min) || !Number.isFinite(max)) {
		return [0, 1];
	}
	if (min === max) {
		return min === 0 ? [0, 1] : [Math.min(0, min), Math.max(0, max)];
	}
	const step = tickStep(min, max, count);
	if (step === 0) {
		return [min, max];
	}
	return [
		roundToStep(Math.floor(min / step) * step, step),
		roundToStep(Math.ceil(max / step) * step, step),
	];
}

/**
 * The `[min, max]` of a set of values, always including zero so bars are
 * measured from a real baseline rather than from an arbitrary floor.
 */
export function extentFromZero(
	values: ReadonlyArray<number>,
): readonly [number, number] {
	let min = 0;
	let max = 0;
	for (const value of values) {
		if (!Number.isFinite(value)) {
			continue;
		}
		min = Math.min(min, value);
		max = Math.max(max, value);
	}
	return [min, max];
}
