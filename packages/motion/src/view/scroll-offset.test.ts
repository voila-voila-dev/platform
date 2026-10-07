import { describe, expect, it } from "vitest";

import {
	ENTER_TO_EXIT,
	FULL_RANGE,
	offsetPosition,
	parseOffsetPoint,
	resolveEdge,
	scrollProgress,
} from "#/view/scroll-offset.ts";

describe("resolveEdge", () => {
	it("reads named edges, fractions, pixels and percentages", () => {
		expect(resolveEdge("start", 200)).toBe(0);
		expect(resolveEdge("center", 200)).toBe(100);
		expect(resolveEdge("end", 200)).toBe(200);
		expect(resolveEdge(0.25, 200)).toBe(50);
		expect(resolveEdge("30px", 200)).toBe(30);
		expect(resolveEdge("10%", 200)).toBe(20);
	});

	it("refuses an edge it cannot read", () => {
		expect(() => resolveEdge("middle" as "start", 100)).toThrow();
	});
});

describe("parseOffsetPoint", () => {
	it("splits the target edge from the container edge", () => {
		expect(parseOffsetPoint("start end")).toEqual(["start", "end"]);
		expect(parseOffsetPoint("0.5 20px")).toEqual([0.5, "20px"]);
		expect(parseOffsetPoint("center center")).toEqual(["center", "center"]);
		expect(parseOffsetPoint([0, "end"])).toEqual([0, "end"]);
	});
});

describe("scrollProgress", () => {
	// A 100 px target at 1000 px in a 400 px viewport.
	const target = { targetStart: 1000, targetLength: 100, viewportLength: 400 };

	it("runs from the target entering to it leaving", () => {
		expect(offsetPosition(ENTER_TO_EXIT[0], target)).toBe(600);
		expect(offsetPosition(ENTER_TO_EXIT[1], target)).toBe(1100);
		expect(scrollProgress(600, ENTER_TO_EXIT, target)).toBe(0);
		expect(scrollProgress(850, ENTER_TO_EXIT, target)).toBe(0.5);
		expect(scrollProgress(2000, ENTER_TO_EXIT, target)).toBe(1);
		expect(scrollProgress(0, ENTER_TO_EXIT, target)).toBe(0);
	});

	it("covers the whole scroll range without a target", () => {
		const content = { targetStart: 0, targetLength: 1400, viewportLength: 400 };
		expect(scrollProgress(500, FULL_RANGE, content)).toBe(0.5);
	});

	it("is a step when both offsets are the same position", () => {
		const offset = ["start start", "start start"] as const;
		expect(scrollProgress(999, offset, target)).toBe(0);
		expect(scrollProgress(1000, offset, target)).toBe(1);
	});
});
