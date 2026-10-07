import { describe, expect, it } from "vitest";

import { mixComplex } from "#/interpolate/complex.ts";

describe("mixComplex", () => {
	it("mixes the numbers of strings with the same skeleton", () => {
		expect(mixComplex("10px 20px", "20px 40px")?.(0.5)).toBe("15px 30px");
		expect(
			mixComplex(
				"translateX(0px) rotate(0deg)",
				"translateX(100px) rotate(90deg)",
			)?.(0.25),
		).toBe("translateX(25px) rotate(22.5deg)");
	});

	it("mixes colours inside a string", () => {
		expect(mixComplex("0 0 4px #000000", "0 0 8px #000000")?.(0.5)).toBe(
			"0 0 6px rgba(0, 0, 0, 1)",
		);
	});

	it("has no midpoint for different skeletons", () => {
		expect(mixComplex("10px", "10%")).toBeUndefined();
		expect(mixComplex("auto", "none")).toBeUndefined();
	});
});
