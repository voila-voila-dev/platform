import { describe, expect, it } from "vitest";

import { compileChart } from "#/core/compile.ts";
import { defineChart } from "#/core/define-chart.ts";
import { forceGraph } from "#/force/force.ts";
import { sunburstMark, treeMark, treemapMark } from "#/hierarchy/hierarchy.ts";
import { sankey } from "#/sankey/sankey.ts";

interface Node {
	name: string;
	size?: number;
	children?: Node[];
}

const root: Node = {
	name: "Tries",
	children: [
		{
			name: "Kiné",
			children: [
				{ name: "Sport", size: 30 },
				{ name: "Cabinet", size: 10 },
			],
		},
		{ name: "Médecin", children: [{ name: "Urgences", size: 20 }] },
	],
};
const options = {
	name: (node: Node) => node.name,
	value: (node: Node) => node.size ?? 0,
	label: "Missions",
};
const SIZE = { width: 500, height: 300 };

describe("hierarchy, sankey and force marks", () => {
	it("gives each treemap leaf an area in proportion to its value", () => {
		const scene = compileChart(
			defineChart({ marks: [treemapMark(root, options)] }),
			SIZE,
		);
		expect(scene.points.map((point) => point.title)).toEqual([
			"Kiné › Sport",
			"Kiné › Cabinet",
			"Médecin › Urgences",
		]);
		const areas = scene.points.map((point) =>
			point.hit?.kind === "rect"
				? point.hit.rect.width * point.hit.rect.height
				: 0,
		);
		expect(areas[0] / areas[1]).toBeGreaterThan(2);
		expect(scene.legend.map((item) => item.label)).toEqual(["Kiné", "Médecin"]);
	});

	it("puts every node but the root on a sunburst ring", () => {
		const scene = compileChart(
			defineChart({ marks: [sunburstMark(root, options)] }),
			SIZE,
		);
		expect(scene.points).toHaveLength(5);
		expect(scene.points.every((point) => point.hit?.kind === "arc")).toBe(true);
	});

	it("draws the tree's nodes and links", () => {
		const scene = compileChart(
			defineChart({ marks: [treeMark(root, options)] }),
			SIZE,
		);
		expect(scene.points).toHaveLength(6);
	});

	it("makes sankey nodes and links focusable", () => {
		const scene = compileChart(
			defineChart({
				marks: [
					sankey({
						nodes: [
							{ id: "a", label: "Visites" },
							{ id: "b", label: "Inscriptions" },
							{ id: "c", label: "Missions" },
						],
						links: [
							{ source: "a", target: "b", value: 100 },
							{ source: "b", target: "c", value: 40 },
						],
					}),
				],
			}),
			SIZE,
		);
		expect(scene.points.map((point) => point.title)).toContain(
			"Visites → Inscriptions",
		);
		expect(
			scene.points.find((point) => point.title === "Inscriptions")?.value,
		).toBe("100");
		expect(scene.legend).toHaveLength(0);
	});

	it("settles a force graph the same way every time", () => {
		const graph = {
			nodes: ["a", "b", "c", "d"].map((id) => ({ id })),
			links: [
				{ source: "a", target: "b" },
				{ source: "b", target: "c" },
				{ source: "c", target: "a" },
				{ source: "c", target: "d" },
			],
		};
		const first = compileChart(
			defineChart({ marks: [forceGraph(graph)] }),
			SIZE,
		);
		const second = compileChart(
			defineChart({ marks: [forceGraph(graph)] }),
			SIZE,
		);
		expect(first.points.map((point) => [point.x, point.y])).toEqual(
			second.points.map((point) => [point.x, point.y]),
		);
		expect(first.points.find((point) => point.title === "c")?.value).toBe("3");
		for (const point of first.points) {
			expect(point.x).toBeGreaterThanOrEqual(0);
			expect(point.x).toBeLessThanOrEqual(SIZE.width);
		}
	});
});
