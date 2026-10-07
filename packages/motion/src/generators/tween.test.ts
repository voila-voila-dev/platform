import { describe, expect, it } from "vitest";
import { tween } from "#/generators/tween.ts";

describe("tween", () => {
	it("goes from the first keyframe to the last over the duration", () => {
		const generator = tween({
			keyframes: [0, 100],
			duration: 1,
			ease: "linear",
		});
		expect(generator.duration).toBe(1);
		expect(generator.at(0).value).toBe(0);
		expect(generator.at(0.25).value).toBeCloseTo(25, 6);
		expect(generator.at(0.25).velocity).toBeCloseTo(100, 3);
		expect(generator.at(1)).toEqual({ value: 100, velocity: 0, done: true });
	});

	it("passes through every keyframe at its time, with an easing per segment", () => {
		const generator = tween({
			keyframes: [0, 10, 0],
			times: [0, 0.2, 1],
			duration: 1,
			ease: ["linear", "easeIn"],
		});
		expect(generator.at(0.1).value).toBeCloseTo(5, 6);
		expect(generator.at(0.2).value).toBeCloseTo(10, 6);
		expect(generator.at(0.6).value).toBeGreaterThan(5);
	});

	it("accepts a bezier tuple as one easing", () => {
		const generator = tween({
			keyframes: [0, 1],
			duration: 1,
			ease: [0, 0, 0.58, 1],
		});
		expect(generator.at(0.5).value).toBeCloseTo(0.6846, 3);
	});

	it("is done at once with no duration", () => {
		expect(tween({ keyframes: [0, 3], duration: 0 }).at(0)).toEqual({
			value: 3,
			velocity: 0,
			done: true,
		});
	});
});
