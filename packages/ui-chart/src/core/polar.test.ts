import { describe, expect, it } from "vitest";

import {
	axisAngle,
	polarToCartesian,
	ringPoints,
	ringRadii,
	sliceAngles,
} from "#/core/polar.ts";

describe("polarToCartesian", () => {
	it("puts zero degrees at twelve o'clock and turns clockwise", () => {
		const top = polarToCartesian(0, 0, 10, 0);
		expect(top.x).toBeCloseTo(0, 10);
		expect(top.y).toBeCloseTo(-10, 10);

		const right = polarToCartesian(0, 0, 10, 90);
		expect(right.x).toBeCloseTo(10, 10);
		expect(right.y).toBeCloseTo(0, 10);

		const bottom = polarToCartesian(0, 0, 10, 180);
		expect(bottom.y).toBeCloseTo(10, 10);
	});

	it("offsets from the given centre", () => {
		const moved = polarToCartesian(100, 50, 10, 90);
		expect(moved.x).toBeCloseTo(110, 10);
		expect(moved.y).toBeCloseTo(50, 10);
	});
});

describe("sliceAngles", () => {
	it("splits a full turn proportionally", () => {
		const slices = sliceAngles([1, 1, 2]);
		expect(slices.map((slice) => slice.startAngle)).toEqual([0, 90, 180]);
		expect(slices.map((slice) => slice.endAngle)).toEqual([90, 180, 360]);
		expect(slices.map((slice) => slice.fraction)).toEqual([0.25, 0.25, 0.5]);
	});

	it("honours a partial span", () => {
		const slices = sliceAngles([1, 1], { startAngle: 90, endAngle: 270 });
		expect(slices[0]).toMatchObject({ startAngle: 90, endAngle: 180 });
		expect(slices[1]).toMatchObject({ startAngle: 180, endAngle: 270 });
	});

	it("takes the padding out of the available sweep", () => {
		const slices = sliceAngles([1, 1], { padAngle: 20 });
		expect(slices[0]).toMatchObject({ startAngle: 10, endAngle: 170 });
		expect(slices[1]).toMatchObject({ startAngle: 190, endAngle: 350 });
	});

	it("treats negatives as empty rather than flipping a slice", () => {
		const slices = sliceAngles([-5, 5]);
		expect(slices[0].fraction).toBe(0);
		expect(slices[1].fraction).toBe(1);
		expect(slices[0].value).toBe(-5);
	});

	it("gives every slice zero width when nothing has a value", () => {
		const slices = sliceAngles([0, 0]);
		expect(slices.every((slice) => slice.startAngle === slice.endAngle)).toBe(
			true,
		);
	});
});

describe("axisAngle", () => {
	it("spreads axes evenly over a turn", () => {
		expect(axisAngle(0, 4)).toBe(0);
		expect(axisAngle(1, 4)).toBe(90);
		expect(axisAngle(3, 4)).toBe(270);
		expect(axisAngle(1, 4, 45)).toBe(135);
	});
});

describe("ringPoints", () => {
	it("returns one vertex per axis", () => {
		const vertices = ringPoints(0, 0, 10, 4);
		expect(vertices).toHaveLength(4);
		expect(vertices[0].y).toBeCloseTo(-10, 10);
		expect(vertices[1].x).toBeCloseTo(10, 10);
	});
});

describe("ringRadii", () => {
	it("returns evenly spaced rings, outermost first, never the centre", () => {
		expect(ringRadii(100, 4)).toEqual([100, 75, 50, 25]);
		expect(ringRadii(100, 0)).toEqual([]);
	});
});
