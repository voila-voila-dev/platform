import { describe, expect, it } from "vitest";
import { stagger } from "#/stagger/stagger.ts";

describe("stagger", () => {
	it("spaces neighbours by the gap, from the first", () => {
		const delay = stagger(0.1);
		expect([0, 1, 2].map((index) => delay(index, 3))).toEqual([0, 0.1, 0.2]);
	});

	it("starts from the last, the centre or an index", () => {
		expect(stagger(1, { from: "last" })(0, 3)).toBe(2);
		expect(
			[0, 1, 2].map((index) => stagger(1, { from: "center" })(index, 3)),
		).toEqual([1, 0, 1]);
		expect(stagger(1, { from: 2 })(0, 4)).toBe(2);
	});

	it("adds the start delay", () => {
		expect(stagger(0.1, { startDelay: 0.5 })(2, 3)).toBeCloseTo(0.7);
	});

	it("spreads along an easing and keeps the same ends", () => {
		const delay = stagger(0.1, { ease: "easeIn" });
		expect(delay(0, 5)).toBe(0);
		expect(delay(4, 5)).toBeCloseTo(0.4);
		expect(delay(2, 5)).toBeLessThan(0.2);
	});
});
