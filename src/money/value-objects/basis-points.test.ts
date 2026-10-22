import { describe, expect, it } from "bun:test";
import { Schema } from "effect";
import {
	applyBasisPoints,
	BasisPoints,
	basisPointsFromPercent,
	percentFromBasisPoints,
} from "#money/value-objects/basis-points";

describe("basis points", () => {
	it("scales a percentage, fractional ones included, rounding half-up", () => {
		expect(basisPointsFromPercent(20)).toBe(2000);
		expect(basisPointsFromPercent(5.5)).toBe(550);
		expect(basisPointsFromPercent(0.005)).toBe(1);
		expect(basisPointsFromPercent(0.004)).toBe(0);
	});

	it("reads back the percentage", () => {
		expect(percentFromBasisPoints(250)).toBe(2.5);
		expect(percentFromBasisPoints(basisPointsFromPercent(12.5))).toBe(12.5);
	});

	it("applies a rate to an amount, rounding half-up", () => {
		expect(applyBasisPoints(1000, 550)).toBe(55);
		expect(applyBasisPoints(5, 1000)).toBe(1);
	});

	it("accepts only integers from 0 to 10000", () => {
		const is = Schema.is(BasisPoints);
		expect([0, 2000, 10_000].every(is)).toBe(true);
		expect([-1, 10_001, 2.5].some(is)).toBe(false);
	});
});
