import { describe, expect, it } from "vitest";
import { linearEasing, supportsLinearEasing } from "#/easing/linear-css.ts";

function points(css: string): number[] {
	return css.slice("linear(".length, -1).split(", ").map(Number);
}

describe("linearEasing", () => {
	it("samples the easing every step, from 0 to 1", () => {
		const css = linearEasing((progress) => progress * progress, 0.1);
		expect(css.startsWith("linear(")).toBe(true);
		const values = points(css);
		expect(values).toHaveLength(11);
		expect(values[0]).toBe(0);
		expect(values.at(-1)).toBe(1);
		expect(values[5]).toBe(0.25);
	});

	it("caps the point count for long motions", () => {
		expect(points(linearEasing((progress) => progress, 30))).toHaveLength(200);
	});

	it("reports no support without CSS (server, jsdom without CSS.supports)", () => {
		expect(typeof supportsLinearEasing()).toBe("boolean");
	});
});
