import { describe, expect, it } from "vitest";
import { springEasing } from "#/easing/spring.ts";

describe("springEasing", () => {
	it("is a linear() string from 0 to 1 over the settle duration", () => {
		const { duration, easing, at } = springEasing({ duration: 0.4 });
		expect(duration).toBeGreaterThan(0.2);
		expect(easing.startsWith("linear(0, ")).toBe(true);
		expect(easing.endsWith(", 1)")).toBe(true);
		expect(at(0)).toBe(0);
		expect(at(1)).toBe(1);
	});

	it("overshoots in the string when it bounces", () => {
		const { easing } = springEasing({ duration: 0.4, bounce: 0.3 });
		const values = easing.slice(7, -1).split(", ").map(Number);
		expect(Math.max(...values)).toBeGreaterThan(1);
	});
});
