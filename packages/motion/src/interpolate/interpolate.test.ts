import { describe, expect, it } from "vitest";

import { interpolate } from "#/interpolate/interpolate.ts";

describe("interpolate", () => {
	it("maps through several segments", () => {
		const map = interpolate([0, 50, 100], [0, 1, 0]);
		expect(map(25)).toBeCloseTo(0.5);
		expect(map(50)).toBe(1);
		expect(map(75)).toBeCloseTo(0.5);
	});

	it("clamps by default and extrapolates when asked not to", () => {
		expect(interpolate([0, 100], [0, 1])(150)).toBe(1);
		expect(interpolate([0, 100], [0, 1], { clamp: false })(150)).toBeCloseTo(
			1.5,
		);
		expect(interpolate([0, 100], [0, 1], { clamp: false })(-50)).toBeCloseTo(
			-0.5,
		);
	});

	it("runs a descending input", () => {
		const map = interpolate([100, 0], [0, 1]);
		expect(map(100)).toBe(0);
		expect(map(25)).toBeCloseTo(0.75);
		expect(map(-10)).toBe(1);
	});

	it("eases each segment", () => {
		const map = interpolate([0, 1, 2], [0, 1, 2], {
			ease: ["easeIn", "linear"],
		});
		expect(map(0.5)).toBeLessThan(0.5);
		expect(map(1.5)).toBeCloseTo(1.5);
		expect(
			interpolate([0, 1], [0, 10], { ease: (p) => p * p })(0.5),
		).toBeCloseTo(2.5);
	});

	it("mixes colours and holds a single stop", () => {
		expect(interpolate([0, 1], ["#000", "#fff"])(0.5)).toBe(
			"rgba(99, 99, 99, 1)",
		);
		expect(interpolate([5], ["only"])(100)).toBe("only");
	});
});
