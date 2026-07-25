import { describe, expect, it } from "vitest";

import {
	bandScale,
	isLinearScale,
	linearScale,
	pointScale,
} from "#/chart/core/scales.ts";

describe("linearScale", () => {
	const scale = linearScale({ domain: [0, 100], range: [0, 200] });

	it("maps the domain onto the range", () => {
		expect(scale.scale(0)).toBe(0);
		expect(scale.scale(50)).toBe(100);
		expect(scale.scale(100)).toBe(200);
	});

	it("extrapolates outside the domain", () => {
		expect(scale.scale(150)).toBe(300);
		expect(scale.scale(-25)).toBe(-50);
	});

	it("inverts back to the domain", () => {
		expect(scale.invert(100)).toBe(50);
		expect(scale.invert(0)).toBe(0);
	});

	it("runs backwards for a value axis", () => {
		const axis = linearScale({ domain: [0, 50], range: [200, 0] });
		expect(axis.scale(0)).toBe(200);
		expect(axis.scale(50)).toBe(0);
		expect(axis.scale(25)).toBe(100);
	});

	it("centres a flat series instead of dividing by zero", () => {
		const flat = linearScale({ domain: [7, 7], range: [0, 120] });
		expect(flat.scale(7)).toBe(60);
		expect(flat.invert(60)).toBe(7);
	});

	it("offers round ticks from its own domain", () => {
		expect(scale.ticks(5)).toEqual([0, 20, 40, 60, 80, 100]);
	});
});

describe("bandScale", () => {
	const scale = bandScale({
		domain: ["a", "b", "c", "d"],
		range: [0, 100],
		paddingInner: 0,
		paddingOuter: 0,
	});

	it("splits the range into equal slots", () => {
		expect(scale.step).toBe(25);
		expect(scale.bandwidth).toBe(25);
		expect(scale.scale("a")).toBe(0);
		expect(scale.scale("c")).toBe(50);
		expect(scale.center("a")).toBe(12.5);
	});

	it("takes padding out of the slots", () => {
		const padded = bandScale({
			domain: ["a", "b"],
			range: [0, 100],
			paddingInner: 0.5,
			paddingOuter: 0.25,
		});
		expect(padded.step).toBe(50);
		expect(padded.bandwidth).toBe(25);
		expect(padded.scale("a")).toBe(12.5);
		expect(padded.scale("b")).toBe(62.5);
	});

	it("inverts a pixel to the slot it falls in, clamped to the domain", () => {
		expect(scale.invert(0)).toBe(0);
		expect(scale.invert(60)).toBe(2);
		expect(scale.invert(999)).toBe(3);
		expect(scale.invert(-999)).toBe(0);
	});

	it("collapses a repeated category onto its first slot", () => {
		const repeated = bandScale({
			domain: ["a", "b", "a"],
			range: [0, 90],
			paddingInner: 0,
			paddingOuter: 0,
		});
		expect(repeated.scale("a")).toBe(0);
	});

	it("reports its categories as its ticks", () => {
		expect(scale.ticks()).toEqual(["a", "b", "c", "d"]);
	});
});

describe("pointScale", () => {
	const scale = pointScale({ domain: ["a", "b", "c"], range: [0, 100] });

	it("pins the first and last points to the range edges", () => {
		expect(scale.scale("a")).toBe(0);
		expect(scale.scale("b")).toBe(50);
		expect(scale.scale("c")).toBe(100);
		expect(scale.bandwidth).toBe(0);
	});

	it("centres a lone point", () => {
		const single = pointScale({ domain: ["only"], range: [0, 80] });
		expect(single.scale("only")).toBe(40);
	});

	it("inverts to the nearest point", () => {
		expect(scale.invert(24)).toBe(0);
		expect(scale.invert(26)).toBe(1);
		expect(scale.invert(1000)).toBe(2);
	});

	it("insets both ends when padded", () => {
		const padded = pointScale({
			domain: ["a", "b", "c"],
			range: [0, 100],
			padding: 0.5,
		});
		expect(padded.step).toBe(100 / 3);
		expect(padded.scale("a")).toBeCloseTo(100 / 6, 10);
	});
});

describe("isLinearScale", () => {
	it("separates continuous scales from discrete ones", () => {
		expect(isLinearScale(linearScale({ domain: [0, 1], range: [0, 1] }))).toBe(
			true,
		);
		expect(isLinearScale(bandScale({ domain: ["a"], range: [0, 1] }))).toBe(
			false,
		);
	});
});
