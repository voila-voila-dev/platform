import { describe, expect, it } from "vitest";

import {
	extentFromZero,
	niceDomain,
	niceTicks,
	tickStep,
} from "#/core/ticks.ts";

describe("tickStep", () => {
	it("picks a round step for the requested tick count", () => {
		expect(tickStep(0, 100, 5)).toBe(20);
		expect(tickStep(0, 10, 5)).toBe(2);
		expect(tickStep(0, 1, 5)).toBe(0.2);
		expect(tickStep(0, 37, 5)).toBe(10);
		expect(tickStep(0, 3, 5)).toBe(0.5);
	});

	it("returns zero for a degenerate span", () => {
		expect(tickStep(5, 5, 5)).toBe(0);
		expect(tickStep(10, 0, 5)).toBe(0);
		expect(tickStep(0, 100, 0)).toBe(0);
	});
});

describe("niceTicks", () => {
	it("emits round values inside the domain", () => {
		expect(niceTicks(0, 100, 5)).toEqual([0, 20, 40, 60, 80, 100]);
		expect(niceTicks(0, 37, 5)).toEqual([0, 10, 20, 30]);
	});

	it("keeps fractional steps free of floating point dust", () => {
		expect(niceTicks(0, 1, 5)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);
	});

	it("spans zero when the data does", () => {
		expect(niceTicks(-40, 60, 5)).toEqual([-40, -20, 0, 20, 40, 60]);
	});

	it("collapses a single-value domain to one tick", () => {
		expect(niceTicks(7, 7, 5)).toEqual([7]);
	});
});

describe("niceDomain", () => {
	it("widens the bounds out to whole steps", () => {
		expect(niceDomain(0, 37, 5)).toEqual([0, 40]);
		expect(niceDomain(3, 97, 5)).toEqual([0, 100]);
		expect(niceDomain(-12, 46, 5)).toEqual([-20, 50]);
	});

	it("leaves an already round domain alone", () => {
		expect(niceDomain(0, 100, 5)).toEqual([0, 100]);
	});

	it("falls back to the unit interval for an empty extent at zero", () => {
		expect(niceDomain(0, 0, 5)).toEqual([0, 1]);
	});
});

describe("extentFromZero", () => {
	it("always includes the baseline", () => {
		expect(extentFromZero([12, 30, 8])).toEqual([0, 30]);
		expect(extentFromZero([-4, -18])).toEqual([-18, 0]);
		expect(extentFromZero([])).toEqual([0, 0]);
	});

	it("ignores values that are not finite", () => {
		expect(extentFromZero([5, Number.NaN, Number.POSITIVE_INFINITY])).toEqual([
			0, 5,
		]);
	});
});
