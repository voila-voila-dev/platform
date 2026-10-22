import { Schema } from "effect";

export const BASIS_POINTS = 10_000;

// Every rate brands this one, so a TaxRate is also BasisPoints: `BasisPoints.pipe(Schema.brand("TaxRate"))`.
export const BasisPoints = Schema.Int.check(
	Schema.makeFilter(
		(basisPoints: number) =>
			(basisPoints >= 0 && basisPoints <= BASIS_POINTS) ||
			`must be between 0 and ${BASIS_POINTS} basis points`,
	),
).pipe(Schema.brand("BasisPoints"));

export type BasisPoints = typeof BasisPoints.Type;

export function applyBasisPoints(amount: number, rate: BasisPoints): number {
	return Math.round((amount * rate) / BASIS_POINTS);
}

// Unbranded: the caller makes the rate it means, `TaxRate.make(basisPointsFromPercent(20))`.
export function basisPointsFromPercent(percent: number): number {
	return Math.round((percent * BASIS_POINTS) / 100);
}

export function percentFromBasisPoints(rate: BasisPoints): number {
	return (rate * 100) / BASIS_POINTS;
}
