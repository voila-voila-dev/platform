import { describe, expect, it } from "vitest";

import { density2d } from "#/contour/density.ts";
import { compileChart } from "#/core/compile.ts";
import { defineChart } from "#/core/define-chart.ts";
import { voronoi } from "#/voronoi/voronoi.ts";

const cloud = Array.from({ length: 200 }, (_unused, index) => ({
	a: Math.sin(index) * 10 + (index % 7),
	b: Math.cos(index * 1.3) * 10 + (index % 5),
}));

describe("d3-backed marks", () => {
	it("draws nested density contours in chart pixels", () => {
		const scene = compileChart(
			defineChart({
				marks: [density2d(cloud, { x: "a", y: "b", thresholds: 5 })],
			}),
			{
				width: 400,
				height: 300,
			},
		);
		const paths = scene.nodes.flatMap((node) =>
			node.kind === "group" && node.key === "marks" ? node.children : [],
		);
		expect(paths.length).toBeGreaterThan(1);
		expect(
			paths.every((node) => node.kind === "path" && node.d.startsWith("M")),
		).toBe(true);
	});

	it("gives every point a voronoi cell inside the plot", () => {
		const scene = compileChart(
			defineChart({ marks: [voronoi(cloud.slice(0, 30), { x: "a", y: "b" })] }),
			{
				width: 400,
				height: 300,
			},
		);
		const cells = scene.nodes.flatMap((node) =>
			node.kind === "group" && node.key === "marks" ? node.children : [],
		);
		expect(cells).toHaveLength(30);
	});
});
