import { describe, expect, it } from "vitest";
import { steps } from "#/easing/steps.ts";

describe("steps", () => {
	it("jumps at the end of each interval by default", () => {
		const easing = steps(4);
		expect([0, 0.2, 0.25, 0.6, 0.99, 1].map(easing)).toEqual([
			0, 0, 0.25, 0.5, 0.75, 1,
		]);
	});

	it("jumps at the start with direction start", () => {
		const easing = steps(4, "start");
		expect([0, 0.2, 0.25, 0.99, 1].map(easing)).toEqual([
			0.25, 0.25, 0.5, 1, 1,
		]);
	});
});
