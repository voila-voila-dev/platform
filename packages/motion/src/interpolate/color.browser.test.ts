import { describe, expect, it } from "vitest";
import { parseColor } from "#/interpolate/color.ts";
import { mix } from "#/interpolate/mix.ts";

describe("colour names in a browser", () => {
	it("spells a name out through the browser", () => {
		expect(parseColor("red")).toEqual({ r: 1, g: 0, b: 0, alpha: 1 });
		expect(parseColor("RebeccaPurple")?.b).toBeCloseTo(0.6, 2);
	});

	it("leaves what isn't a colour, and currentColor, unknown", () => {
		expect(parseColor("auto")).toBeUndefined();
		expect(parseColor("currentColor")).toBeUndefined();
	});

	it("blends red into blue instead of switching halfway", () => {
		const tint = mix("red", "blue");
		expect(tint(0.5)).toMatch(/^rgba\(/);
		expect(tint(0.5)).not.toBe(tint(0.4));
	});

	it("still switches two words that aren't colours", () => {
		const keyword = mix("auto", "none");
		expect(keyword(0.4)).toBe("auto");
		expect(keyword(0.6)).toBe("none");
	});
});
