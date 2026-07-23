import { describe, expect, it } from "vitest";

import { buildChartModel, readNumber } from "#/core/chart-model.ts";

const data = [
	{ month: "January", missions: 24, bookings: 18 },
	{ month: "February", missions: 31, bookings: 22 },
	{ month: "March", missions: 28, bookings: 25 },
];

const build = (
	overrides: Partial<Parameters<typeof buildChartModel>[0]> = {},
) =>
	buildChartModel({
		data,
		category: { key: "month" },
		value: { keys: ["missions", "bookings"] },
		orientation: "vertical",
		innerWidth: 300,
		innerHeight: 100,
		...overrides,
	});

describe("readNumber", () => {
	it("reads finite numbers and numeric strings", () => {
		expect(readNumber({ value: 12 }, "value")).toBe(12);
		expect(readNumber({ value: "3.5" }, "value")).toBe(3.5);
	});

	it("falls back to zero for anything else", () => {
		expect(readNumber({ value: null }, "value")).toBe(0);
		expect(readNumber({ value: "n/a" }, "value")).toBe(0);
		expect(readNumber({}, "missing")).toBe(0);
		expect(readNumber({ value: Number.NaN }, "value")).toBe(0);
	});
});

describe("buildChartModel", () => {
	it("reads the categories off the declared field", () => {
		expect(build().categories).toEqual(["January", "February", "March"]);
	});

	it("falls back to the row index when the field is missing", () => {
		expect(build({ category: { key: "absent" } }).categories).toEqual([
			"0",
			"1",
			"2",
		]);
	});

	it("covers every series from a zero baseline, rounded out", () => {
		expect(build().valueScale.domain).toEqual([0, 35]);
	});

	it("sums the series when they are stacked", () => {
		const stacked = build({
			value: { keys: ["missions", "bookings"], stacked: true },
		});
		expect(stacked.valueScale.domain).toEqual([0, 60]);
	});

	it("keeps an explicit domain exactly as given", () => {
		const pinned = build({
			value: { keys: ["missions"], domain: [0, 100] },
		});
		expect(pinned.valueScale.domain).toEqual([0, 100]);
		expect(pinned.valueScale.scale(0)).toBe(100);
		expect(pinned.valueScale.scale(100)).toBe(0);
	});

	it("skips rounding when asked", () => {
		expect(
			build({ value: { keys: ["missions"], nice: false } }).valueScale.domain,
		).toEqual([0, 31]);
	});

	it("puts the categories on x and the values on y when vertical", () => {
		const model = build();
		expect(model.xScale).toBe(model.categoryScale);
		expect(model.yScale).toBe(model.valueScale);
		expect(model.categoryScale.range).toEqual([0, 300]);
		expect(model.valueScale.range).toEqual([100, 0]);
	});

	it("swaps the axes when horizontal", () => {
		const model = build({ orientation: "horizontal" });
		expect(model.xScale).toBe(model.valueScale);
		expect(model.yScale).toBe(model.categoryScale);
		expect(model.categoryScale.range).toEqual([0, 100]);
		expect(model.valueScale.range).toEqual([0, 300]);
	});

	it("uses a point scale for line-style categories", () => {
		const model = build({ category: { key: "month", type: "point" } });
		expect(model.categoryScale.kind).toBe("point");
		expect(model.categoryScale.scale("January")).toBe(0);
		expect(model.categoryScale.scale("March")).toBe(300);
	});

	it("spans zero when a series goes negative", () => {
		const model = buildChartModel({
			data: [
				{ month: "a", net: -180 },
				{ month: "b", net: 540 },
			],
			category: { key: "month" },
			value: { keys: ["net"] },
			orientation: "vertical",
			innerWidth: 100,
			innerHeight: 100,
		});
		expect(model.valueScale.domain).toEqual([-200, 600]);
	});
});
