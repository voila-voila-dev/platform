import { describe, expect, it } from "vitest";

import {
	arcPath,
	areaPath,
	linePath,
	polygonPath,
	roundedBarPath,
} from "#/chart/core/geometry.ts";

const points = [
	{ x: 0, y: 100 },
	{ x: 50, y: 40 },
	{ x: 100, y: 60 },
];

describe("linePath", () => {
	it("joins points with straight segments", () => {
		expect(linePath(points)).toBe("M0,100L50,40L100,60");
	});

	it("steps through the midpoint between two categories", () => {
		expect(linePath(points, "step")).toBe(
			"M0,100L25,100L25,40L50,40L75,40L75,60L100,60",
		);
	});

	it("emits one cubic per segment for a monotone curve", () => {
		const path = linePath(points, "monotone");
		expect(path.startsWith("M0,100")).toBe(true);
		expect(path.match(/C/g)).toHaveLength(2);
	});

	it("never overshoots the data on a monotone curve", () => {
		const rising = linePath(
			[
				{ x: 0, y: 100 },
				{ x: 10, y: 100 },
				{ x: 20, y: 0 },
			],
			"monotone",
		);
		// The flat first segment has zero slope at both ends, so its control
		// points sit exactly on the line rather than dipping below it.
		expect(rising).toContain("C3.33,100 6.67,100 10,100");
	});

	it("renders nothing for fewer than two points", () => {
		expect(linePath([])).toBe("");
		expect(linePath([{ x: 1, y: 2 }])).toBe("");
	});
});

describe("areaPath", () => {
	it("closes the line down onto the baseline", () => {
		expect(areaPath(points, 120)).toBe("M0,100L50,40L100,60L100,120L0,120Z");
	});

	it("renders nothing without a line to close", () => {
		expect(areaPath([{ x: 0, y: 0 }], 10)).toBe("");
	});
});

describe("polygonPath", () => {
	it("closes the ring", () => {
		expect(polygonPath(points)).toBe("M0,100L50,40L100,60Z");
	});

	it("renders nothing when empty", () => {
		expect(polygonPath([])).toBe("");
	});
});

describe("roundedBarPath", () => {
	it("draws a plain rectangle at radius zero", () => {
		expect(roundedBarPath({ x: 10, y: 20, width: 30, height: 40 })).toBe(
			"M10,20H40V60H10V20Z",
		);
	});

	it("rounds only the corners it is given", () => {
		const path = roundedBarPath({
			x: 0,
			y: 0,
			width: 20,
			height: 100,
			radius: [4, 4, 0, 0],
		});
		expect(path).toBe("M4,0H16A4,4 0 0 1 20,4V100H0V4A4,4 0 0 1 4,0Z");
	});

	it("clamps the radius to half the shortest side", () => {
		expect(
			roundedBarPath({ x: 0, y: 0, width: 10, height: 10, radius: 99 }),
		).toBe(roundedBarPath({ x: 0, y: 0, width: 10, height: 10, radius: 5 }));
	});

	it("renders nothing for a collapsed bar", () => {
		expect(roundedBarPath({ x: 0, y: 0, width: 0, height: 10 })).toBe("");
		expect(roundedBarPath({ x: 0, y: 0, width: 10, height: 0 })).toBe("");
	});
});

describe("arcPath", () => {
	it("draws a pie wedge from the centre", () => {
		expect(
			arcPath({
				cx: 100,
				cy: 100,
				innerRadius: 0,
				outerRadius: 50,
				startAngle: 0,
				endAngle: 90,
			}),
		).toBe("M100,100L100,50A50,50 0 0 1 150,100Z");
	});

	it("flags the large-arc sweep past a half turn", () => {
		const path = arcPath({
			cx: 0,
			cy: 0,
			innerRadius: 0,
			outerRadius: 10,
			startAngle: 0,
			endAngle: 270,
		});
		expect(path).toContain("A10,10 0 1 1");
	});

	it("draws a donut segment as two arcs", () => {
		const path = arcPath({
			cx: 0,
			cy: 0,
			innerRadius: 5,
			outerRadius: 10,
			startAngle: 0,
			endAngle: 90,
		});
		expect(path).toBe("M0,-10A10,10 0 0 1 10,0L5,0A5,5 0 0 0 0,-5Z");
	});

	it("splits a full turn so it does not collapse to a point", () => {
		const path = arcPath({
			cx: 0,
			cy: 0,
			innerRadius: 0,
			outerRadius: 10,
			startAngle: 0,
			endAngle: 360,
		});
		expect(path.match(/M/g)).toHaveLength(2);
	});

	it("renders nothing for an empty sweep", () => {
		expect(
			arcPath({
				cx: 0,
				cy: 0,
				innerRadius: 0,
				outerRadius: 10,
				startAngle: 45,
				endAngle: 45,
			}),
		).toBe("");
	});
});
