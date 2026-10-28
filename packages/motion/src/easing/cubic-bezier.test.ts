import { describe, expect, it } from "vitest";
import { cubicBezier } from "#/easing/cubic-bezier.ts";

describe("cubicBezier", () => {
	it("matches CSS ease-out at the middle", () => {
		// Reference values from an independent 60-step bisection of the curve.
		expect(cubicBezier(0, 0, 0.58, 1)(0.5)).toBeCloseTo(0.6846, 3);
	});

	it("matches CSS ease (0.25, 0.1, 0.25, 1) at a quarter", () => {
		expect(cubicBezier(0.25, 0.1, 0.25, 1)(0.25)).toBeCloseTo(0.4085, 3);
	});

	it("is the identity for a straight curve and pins the ends", () => {
		const straight = cubicBezier(0.3, 0.3, 0.7, 0.7);
		expect(straight(0.42)).toBe(0.42);
		const curve = cubicBezier(0.42, 0, 0.58, 1);
		expect(curve(0)).toBe(0);
		expect(curve(1)).toBe(1);
		expect(curve(0.5)).toBeCloseTo(0.5, 6);
	});

	it("is monotone for a monotone curve", () => {
		const curve = cubicBezier(0.42, 0, 1, 1);
		let previous = 0;
		for (let index = 1; index <= 100; index += 1) {
			const value = curve(index / 100);
			expect(value).toBeGreaterThanOrEqual(previous);
			previous = value;
		}
	});
});
