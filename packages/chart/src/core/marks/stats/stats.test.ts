import { describe, expect, it } from "vitest";

import { compileChart } from "#/core/compile.ts";
import { defineChart } from "#/core/define-chart.ts";
import { dot } from "#/core/marks/dot.ts";
import { differenceY } from "#/core/marks/stats/difference.ts";
import { boxY, ridgeline, violinY } from "#/core/marks/stats/distribution.ts";
import { dodgeY } from "#/core/marks/stats/dodge.ts";
import { hexbin, hexCenter } from "#/core/marks/stats/hexbin.ts";
import { binValues, histogram } from "#/core/marks/stats/histogram.ts";
import { regressionY } from "#/core/marks/stats/regression.ts";
import {
	boxSummary,
	kernelDensity,
	linearFit,
	quantile,
} from "#/core/marks/stats/statistics.ts";
import { waffleY } from "#/core/marks/stats/waffle.ts";
import type { ChartScene, SceneNode } from "#/core/types.ts";

const SIZE = { width: 600, height: 300 };

function marks(scene: ChartScene): SceneNode[] {
	const flat = (nodes: ReadonlyArray<SceneNode>): SceneNode[] =>
		nodes.flatMap((node) =>
			node.kind === "group" ? flat(node.children) : [node],
		);
	return flat(scene.nodes).filter((node) => node.role === "mark");
}

describe("statistics", () => {
	it("computes quantiles, boxes, densities and fits", () => {
		expect(quantile([1, 2, 3, 4], 0.5)).toBe(2.5);
		const box = boxSummary([1, 2, 3, 4, 5, 6, 7, 8, 100]);
		expect(box).toMatchObject({
			median: 5,
			q1: 3,
			q3: 7,
			high: 8,
			outliers: [100],
		});
		const density = kernelDensity([0, 0, 0], [0, 5], 1);
		expect(density[0]).toBeGreaterThan(density[1]);
		expect(linearFit([0, 1, 2], [1, 3, 5])).toMatchObject({
			slope: 2,
			intercept: 1,
		});
	});

	it("bins on round edges and keeps the maximum in the last bin", () => {
		const bins = binValues([0, 3, 7, 10], 5);
		expect(bins[0].x1).toBe(0);
		expect(bins[bins.length - 1].x2).toBeGreaterThanOrEqual(10);
	});
});

const scores = Array.from({ length: 40 }, (_unused, index) => ({
	group: index % 2 === 0 ? "A" : "B",
	score: (index * 37) % 23,
	other: (index * 13) % 17,
}));

describe("statistical marks", () => {
	it("draws a histogram on a continuous x that counts every value once", () => {
		const scene = compileChart(
			defineChart({ marks: [histogram(scores, { x: "score", bins: 5 })] }),
			SIZE,
		);
		expect(scene.scales.x?.kind).toBe("linear");
		const total = scene.points.reduce(
			(sum, point) => sum + Number(point.value),
			0,
		);
		expect(total).toBe(scores.length);
	});

	it("draws one box, violin and ridge per group", () => {
		for (const mark of [
			boxY(scores, { category: "group", value: "score" }),
			violinY(scores, { category: "group", value: "score" }),
			ridgeline(scores, { category: "group", value: "score" }),
		]) {
			const scene = compileChart(defineChart({ marks: [mark] }), SIZE);
			expect(scene.points.map((point) => point.title)).toEqual(["A", "B"]);
		}
	});

	it("never lets two beeswarm dots overlap", () => {
		const scene = compileChart(
			defineChart({ marks: [dodgeY(scores, { x: "score", r: 5 })] }),
			SIZE,
		);
		const dots = marks(scene).filter((node) => node.kind === "circle");
		for (const [index, a] of dots.entries()) {
			for (const b of dots.slice(index + 1)) {
				if (a.kind !== "circle" || b.kind !== "circle") continue;
				expect(Math.hypot(a.cx - b.cx, a.cy - b.cy)).toBeGreaterThanOrEqual(10);
			}
		}
	});

	it("fills a waffle with one cell per unit", () => {
		const scene = compileChart(
			defineChart({
				marks: [waffleY([{ k: "a", n: 23 }], { x: "k", y: "n", columns: 10 })],
			}),
			SIZE,
		);
		expect(marks(scene)).toHaveLength(23);
		expect(scene.scales.y?.domain).toEqual([0, 30]);
	});

	it("splits a difference band where the lines cross", () => {
		const rows = [
			{ t: 0, a: 1, b: 2 },
			{ t: 1, a: 3, b: 2 },
			{ t: 2, a: 4, b: 1 },
		];
		const scene = compileChart(
			defineChart({ marks: [differenceY(rows, { x: "t", y1: "a", y2: "b" })] }),
			SIZE,
		);
		expect(
			marks(scene).filter((node) => node.key.includes(":band:")),
		).toHaveLength(2);
		expect(scene.points).toHaveLength(6);
	});

	it("fits a regression line with its band over a scatter", () => {
		const scene = compileChart(
			defineChart({
				marks: [
					dot(scores, { x: "other", y: "score" }),
					regressionY(scores, { x: "other", y: "score" }),
				],
			}),
			SIZE,
		);
		expect(marks(scene).filter((node) => node.kind === "path")).toHaveLength(2);
	});

	it("counts every point into exactly one hexagon", () => {
		expect(hexCenter(0, 0, 10)).toEqual({ x: 0, y: 0 });
		const scene = compileChart(
			defineChart({
				marks: [hexbin(scores, { x: "other", y: "score", radius: 12 })],
			}),
			SIZE,
		);
		const total = scene.points.reduce(
			(sum, point) => sum + Number(point.value),
			0,
		);
		expect(total).toBe(scores.length);
	});
});
