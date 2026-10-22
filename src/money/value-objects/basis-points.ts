import { Schema } from "effect";

export const BASIS_POINTS = 10_000;

export function applyBasisPoints(amount: number, basisPoints: number): number {
	return Math.round((amount * basisPoints) / BASIS_POINTS);
}

export function basisPointsFromPercent(percent: number): number {
	return Math.round((percent * BASIS_POINTS) / 100);
}

export function percentFromBasisPoints(basisPoints: number): number {
	return (basisPoints * 100) / BASIS_POINTS;
}

// The 0..10000 integer every rate brand is built on; `label` names it in the failure.
export function boundedBasisPoints(label: string) {
	return Schema.Int.check(
		Schema.makeFilter(
			(basisPoints: number) =>
				(basisPoints >= 0 && basisPoints <= BASIS_POINTS) ||
				`${label} must be between 0 and ${BASIS_POINTS} basis points`,
		),
	);
}

export const BasisPoints = boundedBasisPoints("basis points").pipe(
	Schema.brand("BasisPoints"),
);

export type BasisPoints = typeof BasisPoints.Type;
