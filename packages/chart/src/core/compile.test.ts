import { describe, expect, it } from "vitest";

import { compileChart } from "#/core/compile.ts";
import { defineChart } from "#/core/define-chart.ts";
import { areaY } from "#/core/marks/area.ts";
import { barX, barY } from "#/core/marks/bar.ts";
import { cell } from "#/core/marks/cell.ts";
import { dot } from "#/core/marks/dot.ts";
import { lineY } from "#/core/marks/line.ts";
import { ruleY } from "#/core/marks/rule.ts";
import { findNearest, focusStops } from "#/core/nearest.ts";
import type { ChartScene, SceneNode } from "#/core/types.ts";

const SIZE = { width: 640, height: 320 };

function flat(nodes: ReadonlyArray<SceneNode>): SceneNode[] {
	return nodes.flatMap((node) =>
		node.kind === "group" ? flat(node.children) : [node],
	);
}

function byRole(scene: ChartScene, role: string): SceneNode[] {
	return flat(scene.nodes).filter((node) => node.role === role);
}

const months = [
	{ month: new Date("2026-01-01"), missions: 12, bookings: 8 },
	{ month: new Date("2026-02-01"), missions: 18, bookings: 11 },
	{ month: new Date("2026-03-01"), missions: 15, bookings: 14 },
];

describe("compileChart", () => {
	it("puts dates on a time scale and the value on a zero-based nice scale", () => {
		const scene = compileChart(
			defineChart({ marks: [lineY(months, { x: "month", y: "missions" })] }),
			SIZE,
		);
		expect(scene.scales.x?.kind).toBe("time");
		expect(scene.scales.y?.kind).toBe("linear");
		expect(scene.scales.y?.domain).toEqual([12, 18]);
		const [line] = byRole(scene, "mark");
		expect(line.kind).toBe("path");
		expect(scene.points).toHaveLength(3);
		expect(scene.points[0].title).toBe("janvier 2026");
		expect(scene.points[0].value).toBe("12");
		expect(scene.focusOrder).toBe("x");
	});

	it("leaves room on the left for the widest y tick label", () => {
		const scene = compileChart(
			defineChart({
				marks: [barY([{ k: "a", v: 1_250_000 }], { x: "k", y: "v" })],
			}),
			SIZE,
		);
		expect(scene.plot.x).toBeGreaterThan(30);
		expect(scene.scales.y?.domain[0]).toBe(0);
	});

	it("stacks bars by color and rounds only the outer end", () => {
		const rows = [
			{ month: "Jan", kind: "club", value: 3 },
			{ month: "Jan", kind: "pro", value: 2 },
			{ month: "Feb", kind: "club", value: 4 },
		];
		const scene = compileChart(
			defineChart({
				marks: [barY(rows, { x: "month", y: "value", color: "kind" })],
			}),
			SIZE,
		);
		expect(scene.scales.x?.kind).toBe("band");
		expect(scene.scales.y?.domain).toEqual([0, 5]);
		const bars = byRole(scene, "mark").filter((node) => node.kind === "rect");
		expect(bars).toHaveLength(3);
		expect(bars[0].kind === "rect" && bars[0].corners).toBeUndefined();
		expect(bars[1].kind === "rect" && bars[1].corners).toEqual([4, 4, 0, 0]);
		expect(scene.legend.map((item) => item.label)).toEqual(["club", "pro"]);
	});

	it("puts groups side by side when asked", () => {
		const rows = [
			{ month: "Jan", kind: "club", value: 3 },
			{ month: "Jan", kind: "pro", value: 2 },
		];
		const scene = compileChart(
			defineChart({
				marks: [
					barY(rows, { x: "month", y: "value", color: "kind", group: true }),
				],
			}),
			SIZE,
		);
		const [first, second] = byRole(scene, "mark");
		if (first.kind !== "rect" || second.kind !== "rect") throw new Error();
		expect(second.x).toBeCloseTo(first.x + first.width);
		expect(scene.scales.y?.domain).toEqual([0, 3]);
	});

	it("walks horizontal bars along y", () => {
		const scene = compileChart(
			defineChart({
				marks: [
					barX(
						[
							{ city: "Nantes", missions: 4 },
							{ city: "Lyon", missions: 7 },
						],
						{ x: "missions", y: "city" },
					),
				],
			}),
			SIZE,
		);
		expect(scene.focusOrder).toBe("y");
		expect(focusStops(scene).map((stop) => stop.key)).toEqual([
			"Nantes",
			"Lyon",
		]);
	});

	it("groups a column of series into one focus stop", () => {
		const scene = compileChart(
			defineChart({
				marks: [
					lineY(months, { x: "month", y: "missions", label: "Missions" }),
					lineY(months, { x: "month", y: "bookings", label: "Bookings" }),
				],
			}),
			SIZE,
		);
		const stops = focusStops(scene);
		expect(stops).toHaveLength(3);
		expect(stops[0].points.map((point) => point.seriesLabel)).toEqual([
			"Missions",
			"Bookings",
		]);
		const hit = findNearest(scene, stops, stops[1].at + 3, scene.plot.y + 10);
		expect(hit?.stop).toBe(1);
	});

	it("stacks areas and keeps the zero baseline", () => {
		const rows = months.flatMap((row) => [
			{ month: row.month, kind: "missions", value: row.missions },
			{ month: row.month, kind: "bookings", value: row.bookings },
		]);
		const scene = compileChart(
			defineChart({
				marks: [areaY(rows, { x: "month", y: "value", color: "kind" })],
			}),
			SIZE,
		);
		expect(scene.scales.y?.domain).toEqual([0, 30]);
		expect(byRole(scene, "mark")).toHaveLength(2);
	});

	it("drops the nodes and points of a hidden series but keeps the axes", () => {
		const rows = [
			{ month: "Jan", kind: "club", value: 3 },
			{ month: "Jan", kind: "pro", value: 2 },
		];
		const definition = defineChart({
			marks: [barY(rows, { x: "month", y: "value", color: "kind" })],
		});
		const scene = compileChart(definition, {
			...SIZE,
			hiddenSeries: new Set(["pro"]),
		});
		expect(byRole(scene, "mark")).toHaveLength(1);
		expect(scene.points).toHaveLength(1);
		expect(scene.scales.y?.domain).toEqual([0, 5]);
	});

	it("covers a rule's value on the y domain", () => {
		const scene = compileChart(
			defineChart({
				marks: [
					lineY(months, { x: "month", y: "missions" }),
					ruleY([30], { label: "Objectif", strokeDasharray: "4 4" }),
				],
			}),
			SIZE,
		);
		expect(scene.scales.y?.domain[1]).toBeGreaterThanOrEqual(30);
		expect(byRole(scene, "rule")).toHaveLength(1);
		expect(byRole(scene, "label")).toHaveLength(1);
	});

	it("hovers a scatter dot only near it", () => {
		const scene = compileChart(
			defineChart({
				marks: [
					dot(
						[
							{ a: 1, b: 2 },
							{ a: 5, b: 9 },
						],
						{ x: "a", y: "b" },
					),
				],
			}),
			SIZE,
		);
		expect(scene.focusOrder).toBe("point");
		const stops = focusStops(scene);
		const target = scene.points[1];
		expect(findNearest(scene, stops, target.x + 2, target.y)?.stop).toBe(1);
		expect(findNearest(scene, stops, 0, 0)).toBeNull();
	});

	it("colours heatmap cells on a sequential scale", () => {
		const scene = compileChart(
			defineChart({
				marks: [
					cell(
						[
							{ day: "lun", hour: "9h", n: 0 },
							{ day: "lun", hour: "10h", n: 10 },
						],
						{ x: "day", y: "hour", color: "n" },
					),
				],
			}),
			SIZE,
		);
		expect(scene.scales.color?.kind).toBe("sequential");
		const cells = byRole(scene, "mark");
		const fills = cells.map((node) =>
			node.kind === "rect" ? node.paint.fill : "",
		);
		expect(fills[1]).toContain("100%");
		expect(fills[0]).toContain(" 0%");
	});

	it("is deterministic, so server and client agree", () => {
		const definition = defineChart({
			marks: [lineY(months, { x: "month", y: "missions" })],
		});
		const first = compileChart(definition, SIZE);
		const second = compileChart(definition, SIZE);
		expect(first.nodes).toEqual(second.nodes);
		expect(first.points).toEqual(second.points);
	});
});
