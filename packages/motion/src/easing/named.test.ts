import { describe, expect, it } from "vitest";
import {
	anticipate,
	backInOut,
	circInOut,
	circOut,
	easingToCss,
	resolveEasing,
} from "#/easing/named.ts";
import type { EasingName } from "#/easing/types.ts";

const NAMES: EasingName[] = [
	"linear",
	"easeIn",
	"easeOut",
	"easeInOut",
	"circIn",
	"circOut",
	"circInOut",
	"backIn",
	"backOut",
	"backInOut",
	"anticipate",
];

describe("named easings", () => {
	it.each(NAMES)("%s starts at 0 and ends at 1", (name) => {
		const easing = resolveEasing(name);
		expect(easing(0)).toBeCloseTo(0, 6);
		expect(easing(1)).toBeCloseTo(1, 2);
	});

	it("mirrors the in-out curves around the middle", () => {
		expect(circInOut(0.5)).toBeCloseTo(0.5, 6);
		expect(backInOut(0.5)).toBeCloseTo(0.5, 6);
		expect(circOut(0.5)).toBeGreaterThan(0.5);
	});

	it("anticipates below zero before it goes", () => {
		expect(Math.min(anticipate(0.1), anticipate(0.2))).toBeLessThan(0);
	});

	it("resolves a bezier tuple and a function", () => {
		expect(resolveEasing([0, 0, 0.58, 1])(0.5)).toBeCloseTo(0.6846, 3);
		const custom = (progress: number) => progress * progress;
		expect(resolveEasing(custom)).toBe(custom);
	});

	it("speaks CSS where CSS can say it", () => {
		expect(easingToCss("linear")).toBe("linear");
		expect(easingToCss("easeOut")).toBe("cubic-bezier(0, 0, 0.58, 1)");
		expect(easingToCss([0.1, 0.2, 0.3, 0.4])).toBe(
			"cubic-bezier(0.1, 0.2, 0.3, 0.4)",
		);
		expect(easingToCss("circIn")).toBeUndefined();
		expect(easingToCss((progress) => progress)).toBeUndefined();
	});
});
