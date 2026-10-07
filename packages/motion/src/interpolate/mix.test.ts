import { describe, expect, it } from "vitest";

import { mix } from "#/interpolate/mix.ts";

describe("mix", () => {
	it("chooses by type", () => {
		expect(mix(0, 10)(0.3)).toBeCloseTo(3);
		expect(mix("#000", "#fff")(0.5)).toBe("rgba(99, 99, 99, 1)");
		expect(mix("var(--a)", "var(--b)")(0.5)).toBe(
			"color-mix(in oklab, var(--b) 50%, var(--a))",
		);
		expect(mix("M0,0L10,10", "M10,10L20,20")(0.5)).toBe("M5,5L15,15");
		expect(mix("1px solid", "3px solid")(0.5)).toBe("2px solid");
		expect(mix([0, "0px"], [10, "10px"])(0.5)).toEqual([5, "5px"]);
		expect(mix({ x: 0, y: { z: 2 } }, { x: 4, y: { z: 4 } })(0.5)).toEqual({
			x: 2,
			y: { z: 3 },
		});
	});

	it("switches halfway for what has no midpoint", () => {
		const step = mix("auto", "none");
		expect(step(0.49)).toBe("auto");
		expect(step(0.5)).toBe("none");
		expect(mix(true, false)(0.7)).toBe(false);
	});
});
