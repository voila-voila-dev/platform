/**
 * The few statistics the statistical marks need, written out: quantiles,
 * kernel density, least squares. Each is a handful of lines, which is less to
 * carry than a dependency.
 */

/** Linear-interpolated quantile of sorted values (the R-7 / Excel definition). */
export function quantile(sorted: ReadonlyArray<number>, p: number): number {
	if (sorted.length === 0) {
		return Number.NaN;
	}
	const position = (sorted.length - 1) * p;
	const below = Math.floor(position);
	const above = Math.ceil(position);
	return sorted[below] + (sorted[above] - sorted[below]) * (position - below);
}

export interface BoxSummary {
	readonly min: number;
	readonly q1: number;
	readonly median: number;
	readonly q3: number;
	readonly max: number;
	/** Whisker ends: the furthest values within 1.5 IQR of the box. */
	readonly low: number;
	readonly high: number;
	readonly outliers: ReadonlyArray<number>;
	readonly count: number;
}

const TUKEY_FENCE = 1.5;

export function boxSummary(
	values: ReadonlyArray<number>,
): BoxSummary | undefined {
	const sorted = values
		.filter(Number.isFinite)
		.sort((left, right) => left - right);
	if (sorted.length === 0) {
		return undefined;
	}
	const q1 = quantile(sorted, 0.25);
	const q3 = quantile(sorted, 0.75);
	const fence = (q3 - q1) * TUKEY_FENCE;
	const inside = sorted.filter(
		(value) => value >= q1 - fence && value <= q3 + fence,
	);
	return {
		min: sorted[0],
		q1,
		median: quantile(sorted, 0.5),
		q3,
		max: sorted[sorted.length - 1],
		low: inside[0] ?? q1,
		high: inside[inside.length - 1] ?? q3,
		outliers: sorted.filter(
			(value) => value < q1 - fence || value > q3 + fence,
		),
		count: sorted.length,
	};
}

/** Silverman's rule of thumb: a bandwidth that suits most unimodal data. */
export function silvermanBandwidth(values: ReadonlyArray<number>): number {
	const count = values.length;
	if (count < 2) {
		return 1;
	}
	const mean = values.reduce((sum, value) => sum + value, 0) / count;
	const deviation = Math.sqrt(
		values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (count - 1),
	);
	const sorted = [...values].sort((left, right) => left - right);
	const spread = Math.min(
		deviation,
		(quantile(sorted, 0.75) - quantile(sorted, 0.25)) / 1.34,
	);
	return 0.9 * (spread || deviation || 1) * count ** -0.2;
}

const GAUSSIAN = 1 / Math.sqrt(2 * Math.PI);

/** Gaussian kernel density of `values`, sampled at `at`. */
export function kernelDensity(
	values: ReadonlyArray<number>,
	at: ReadonlyArray<number>,
	bandwidth = silvermanBandwidth(values),
): ReadonlyArray<number> {
	const count = values.length;
	return at.map((x) => {
		let sum = 0;
		for (const value of values) {
			const u = (x - value) / bandwidth;
			sum += GAUSSIAN * Math.exp(-0.5 * u * u);
		}
		return count === 0 ? 0 : sum / (count * bandwidth);
	});
}

/** `count` evenly spaced samples over `[low, high]`. */
export function samples(low: number, high: number, count: number): number[] {
	if (count < 2 || low === high) {
		return [low];
	}
	return Array.from(
		{ length: count },
		(_unused, index) => low + ((high - low) * index) / (count - 1),
	);
}

export interface LinearFit {
	readonly slope: number;
	readonly intercept: number;
	/** Half-width of the 95 % confidence band of the mean at `x`. */
	readonly margin: (x: number) => number;
}

/** 1.96: a normal approximation of Student's t, fine past a dozen points. */
const Z_95 = 1.96;

export function linearFit(
	xs: ReadonlyArray<number>,
	ys: ReadonlyArray<number>,
): LinearFit | undefined {
	const count = xs.length;
	if (count < 2) {
		return undefined;
	}
	const meanX = xs.reduce((sum, x) => sum + x, 0) / count;
	const meanY = ys.reduce((sum, y) => sum + y, 0) / count;
	let sxx = 0;
	let sxy = 0;
	for (let index = 0; index < count; index += 1) {
		sxx += (xs[index] - meanX) ** 2;
		sxy += (xs[index] - meanX) * (ys[index] - meanY);
	}
	if (sxx === 0) {
		return undefined;
	}
	const slope = sxy / sxx;
	const intercept = meanY - slope * meanX;
	let residuals = 0;
	for (let index = 0; index < count; index += 1) {
		residuals += (ys[index] - (intercept + slope * xs[index])) ** 2;
	}
	const standardError = count > 2 ? Math.sqrt(residuals / (count - 2)) : 0;
	return {
		slope,
		intercept,
		margin: (x) =>
			Z_95 * standardError * Math.sqrt(1 / count + (x - meanX) ** 2 / sxx),
	};
}
