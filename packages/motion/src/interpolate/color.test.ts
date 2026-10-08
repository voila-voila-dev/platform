import { describe, expect, it } from "vitest";

import { mixColor, parseColor } from "#/interpolate/color.ts";

describe("parseColor", () => {
	it("reads hex, rgb, hsl, oklch and transparent", () => {
		expect(parseColor("#f00")).toEqual({ r: 1, g: 0, b: 0, alpha: 1 });
		expect(parseColor("#00ff0080")?.alpha).toBeCloseTo(0.5, 2);
		expect(parseColor("rgb(0 0 255 / 50%)")).toEqual({
			r: 0,
			g: 0,
			b: 1,
			alpha: 0.5,
		});
		expect(parseColor("rgba(255, 0, 0, 0.25)")?.alpha).toBe(0.25);
		const green = parseColor("hsl(120deg 100% 50%)");
		expect(green?.g).toBeCloseTo(1);
		expect(green?.r).toBeCloseTo(0);
		const white = parseColor("oklch(1 0 0)");
		expect(white?.r).toBeCloseTo(1, 3);
		expect(parseColor("oklab(0 0 0)")?.g).toBeCloseTo(0, 5);
		expect(parseColor("transparent")?.alpha).toBe(0);
	});

	it("leaves to the page what only the page knows", () => {
		expect(parseColor("var(--chart-1)")).toBeUndefined();
		// Without a browser to spell it out, a name is the page's too.
		expect(parseColor("red")).toBeUndefined();
	});
});

describe("mixColor", () => {
	it("mixes in oklab: black to white passes a perceptual mid-grey", () => {
		// Oklab L = 0.5 is sRGB ≈ 99, not the 128 an sRGB mix gives.
		expect(mixColor("#000", "#fff")(0.5)).toBe("rgba(99, 99, 99, 1)");
	});

	it("returns the inputs at the ends", () => {
		const tint = mixColor("#000000", "#ffffff");
		expect(tint(0)).toBe("#000000");
		expect(tint(1)).toBe("#ffffff");
	});

	it("fades from transparent without passing through grey", () => {
		expect(mixColor("transparent", "#ff0000")(0.5)).toBe(
			"rgba(255, 0, 0, 0.5)",
		);
	});

	it("falls back to color-mix(), quantised to 2 %, for a var()", () => {
		const tint = mixColor("var(--chart-1)", "#e11d48");
		expect(tint(0.333)).toBe(
			"color-mix(in oklab, #e11d48 34%, var(--chart-1))",
		);
		expect(tint(0)).toBe("var(--chart-1)");
		expect(tint(1)).toBe("#e11d48");
	});
});
