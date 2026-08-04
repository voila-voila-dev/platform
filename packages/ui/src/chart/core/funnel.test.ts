import { describe, expect, it } from "vitest";

import { funnelSlices } from "#/chart/core/funnel.ts";

const frame = { innerWidth: 316, innerHeight: 100, gap: 4 } as const;

describe("funnelSlices", () => {
	it("gives every step an equal band and scales heights to the peak", () => {
		const slices = funnelSlices({ ...frame, values: [200, 100, 50, 25] });
		expect(slices).toHaveLength(4);
		expect(slices.map((slice) => slice.x)).toEqual([0, 80, 160, 240]);
		expect(slices.every((slice) => slice.width === 76)).toBe(true);
		expect(slices[0].leftHeight).toBe(100);
		expect(slices[1].leftHeight).toBe(50);
		expect(slices[3].leftHeight).toBe(12.5);
	});

	it("slopes each right flank down to the next step's height", () => {
		const slices = funnelSlices({ ...frame, values: [200, 100, 50] });
		expect(slices[0].rightHeight).toBe(slices[1].leftHeight);
		expect(slices[1].rightHeight).toBe(slices[2].leftHeight);
	});

	it("keeps the last band rectangular", () => {
		const slices = funnelSlices({ ...frame, values: [200, 100] });
		const last = slices[slices.length - 1];
		expect(last.rightHeight).toBe(last.leftHeight);
	});

	it("centres the trapezoids on the given centre line", () => {
		const [first] = funnelSlices({ ...frame, values: [200], centerY: 50 });
		expect(first.path).toBe("M0,0L316,0L316,100L0,100Z");
	});

	it("reports the conversion into the next step", () => {
		const slices = funnelSlices({ ...frame, values: [200, 100, 25] });
		expect(slices[0].ratioToNext).toBe(0.5);
		expect(slices[1].ratioToNext).toBe(0.25);
		expect(slices[2].ratioToNext).toBeNull();
	});

	it("treats negative values as empty steps instead of drawing upside down", () => {
		const slices = funnelSlices({ ...frame, values: [100, -5, 20] });
		expect(slices[1].leftHeight).toBe(0);
		expect(slices[1].ratioToNext).toBeNull();
	});

	it("draws nothing when every value is zero", () => {
		const slices = funnelSlices({ ...frame, values: [0, 0, 0] });
		expect(slices.every((slice) => slice.path === "")).toBe(true);
	});

	it("returns no slices without data or room", () => {
		expect(funnelSlices({ ...frame, values: [] })).toEqual([]);
		expect(
			funnelSlices({ values: [10], innerWidth: 0, innerHeight: 100 }),
		).toEqual([]);
	});
});
