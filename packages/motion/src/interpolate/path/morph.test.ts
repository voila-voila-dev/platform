import { describe, expect, it } from "vitest";

import { flattenPath } from "#/interpolate/path/flatten.ts";
import { mixPath } from "#/interpolate/path/morph.ts";
import { parsePath } from "#/interpolate/path/parse.ts";
import { matchRings } from "#/interpolate/path/rings.ts";

const SQUARE = "M0 0 H100 V100 H0 Z";
const CIRCLE = "M50 0 A50 50 0 1 1 50 100 A50 50 0 1 1 50 0 Z";
const TWO_SQUARES = "M0 0h40v40h-40z M60 60h40v40h-40z";
const FRAMES = Array.from({ length: 21 }, (_unused, index) => index / 20);

function isValid(d: string): boolean {
	const commands = parsePath(d);
	return (
		commands?.every((command) => command.values.every(Number.isFinite)) ?? false
	);
}

describe("parsePath", () => {
	it("makes every command absolute, with implicit repeats and packed arc flags", () => {
		expect(parsePath("m10 10 5 5 h5 v-5 z")).toEqual([
			{ type: "M", values: [10, 10] },
			{ type: "L", values: [15, 15] },
			{ type: "L", values: [20, 15] },
			{ type: "L", values: [20, 10] },
			{ type: "Z", values: [] },
		]);
		expect(parsePath("M0 0a5 5 0 1010 0")?.[1]).toEqual({
			type: "A",
			values: [5, 5, 0, 1, 0, 10, 0],
		});
		expect(parsePath("M0 0 C0 10 10 10 10 0 S20 -10 20 0")?.[2]).toEqual({
			type: "C",
			values: [10, -10, 20, -10, 20, 0],
		});
	});

	it("rejects what is not a path", () => {
		expect(parsePath("L0 0")).toBeUndefined();
		expect(parsePath("M0 0 L5")).toBeUndefined();
		expect(parsePath("M0 0 X")).toBeUndefined();
	});
});

describe("flattenPath", () => {
	it("traces an arc on its circle", () => {
		const [ring] = flattenPath(parsePath(CIRCLE) ?? []);
		expect(ring?.closed).toBe(true);
		for (const [x, y] of ring?.points ?? []) {
			expect(Math.hypot(x - 50, y - 50)).toBeCloseTo(50, 3);
		}
		expect(ring?.points.length).toBeGreaterThan(16);
	});
});

describe("matchRings", () => {
	it("pairs each ring with its nearest counterpart", () => {
		const from = flattenPath(
			parsePath("M60 60h40v40h-40z M0 0h40v40h-40z") ?? [],
		);
		const to = flattenPath(
			parsePath("M2 2h36v36h-36z M62 62h36v36h-36z") ?? [],
		);
		const pairs = matchRings(from, to);
		expect(pairs).toHaveLength(2);
		for (const [a, b] of pairs) {
			expect(
				Math.abs((a?.points[0]?.[0] ?? 0) - (b?.points[0]?.[0] ?? 0)),
			).toBeLessThan(5);
		}
	});

	it("leaves a ring with no counterpart unpaired", () => {
		const one = flattenPath(parsePath(SQUARE) ?? []);
		const two = flattenPath(parsePath(TWO_SQUARES) ?? []);
		expect(matchRings(one, two).filter(([a]) => a === undefined)).toHaveLength(
			1,
		);
	});
});

describe("mixPath", () => {
	it("is the identity when a shape morphs into itself", () => {
		for (const shape of [SQUARE, CIRCLE, TWO_SQUARES]) {
			const morph = mixPath(shape, shape);
			for (const progress of FRAMES) {
				expect(morph(progress)).toBe(shape);
			}
		}
	});

	it("mixes the numbers of paths that share their commands", () => {
		expect(mixPath("M0 0 L10 10", "M10 0 L20 20")(0.5)).toBe("M5 0 L15 15");
	});

	it("draws a valid path on every frame of a square to a circle", () => {
		const morph = mixPath(SQUARE, CIRCLE);
		expect(morph(0)).toBe(SQUARE);
		expect(morph(1)).toBe(CIRCLE);
		for (const progress of FRAMES.slice(1, -1)) {
			const d = morph(progress);
			expect(isValid(d)).toBe(true);
			expect(d.endsWith("Z")).toBe(true);
		}
	});

	it("lines up the rings so points travel little", () => {
		const middle = mixPath(SQUARE, CIRCLE)(0.5);
		const [ring] = flattenPath(parsePath(middle) ?? []);
		for (const [x, y] of ring?.points ?? []) {
			expect(Math.hypot(x - 50, y - 50)).toBeLessThan(65);
		}
	});

	it("grows a second ring from its centroid", () => {
		const morph = mixPath(SQUARE, TWO_SQUARES);
		for (const progress of FRAMES.slice(1, -1)) {
			const d = morph(progress);
			expect(isValid(d)).toBe(true);
			expect(d.match(/M/g)).toHaveLength(2);
		}
		const extents = flattenPath(parsePath(morph(0.02)) ?? []).map(
			({ points }) => {
				const xs = points.map(([x]) => x);
				return Math.max(...xs) - Math.min(...xs);
			},
		);
		// One ring is nearly the square, the other a speck about to grow.
		expect(Math.min(...extents)).toBeLessThan(2);
		expect(Math.max(...extents)).toBeGreaterThan(90);
	});

	it("steps between strings that are not paths", () => {
		expect(mixPath("M0 0 L", "M1 1")(0.4)).toBe("M0 0 L");
	});
});
