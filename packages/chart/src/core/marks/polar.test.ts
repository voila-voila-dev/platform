import { describe, expect, it } from "vitest";

import { compileChart } from "#/core/compile.ts";
import { defineChart } from "#/core/define-chart.ts";
import { funnel } from "#/core/marks/funnel.ts";
import {
	arc,
	donut,
	radar,
	radialBar,
	sliceAngles,
} from "#/core/marks/polar.ts";
import { findNearest, focusStops } from "#/core/nearest.ts";
import type { ChartScene, SceneNode } from "#/core/types.ts";

const SIZE = { width: 400, height: 300 };

function flat(nodes: ReadonlyArray<SceneNode>): SceneNode[] {
	return nodes.flatMap((node) =>
		node.kind === "group" ? flat(node.children) : [node],
	);
}

/** French Intl output spaces with U+202F; the tests read plain spaces. */
function plain(text: string): string {
	return text.replace(/\s/gu, " ");
}

function marks(scene: ChartScene): SceneNode[] {
	return flat(scene.nodes).filter((node) => node.role === "mark");
}

const kinds = [
	{ kind: "Kiné", missions: 30 },
	{ kind: "Médecin", missions: 10 },
	{ kind: "Ostéo", missions: 0 },
];

describe("sliceAngles", () => {
	it("splits the turn in proportion and skips padding for a lone slice", () => {
		expect(
			sliceAngles([3, 1]).map((slice) => slice.endAngle - slice.startAngle),
		).toEqual([270, 90]);
		expect(sliceAngles([5, 0], 2)[0]).toMatchObject({
			startAngle: 0,
			endAngle: 360,
		});
	});
});

describe("arc", () => {
	const scene = compileChart(
		defineChart({
			marks: [arc(kinds, { category: "kind", value: "missions" })],
		}),
		SIZE,
	);

	it("draws one slice per non-empty category and lists them in the legend", () => {
		expect(marks(scene)).toHaveLength(2);
		expect(scene.legend.map((item) => item.label)).toEqual([
			"Kiné",
			"Médecin",
			"Ostéo",
		]);
		expect(scene.scales.x).toBeUndefined();
	});

	it("says each slice's share", () => {
		expect(scene.points.map((point) => plain(point.value))).toEqual([
			"30 (75 %)",
			"10 (25 %)",
		]);
		expect(scene.focusOrder).toBe("point");
		expect(scene.xLabel).toBe("kind");
	});

	it("hits the slice under the pointer, and nothing in a donut's hole", () => {
		const stops = focusStops(scene);
		const { x, y, width, height } = scene.plot;
		// Right of centre is three o'clock: inside the 270° slice.
		expect(
			findNearest(scene, stops, x + width / 2 + 40, y + height / 2)?.stop,
		).toBe(0);
		// Up and slightly left: the last quarter, the 90° slice.
		expect(
			findNearest(scene, stops, x + width / 2 - 40, y + height / 2 - 5)?.stop,
		).toBe(1);
		const ring = compileChart(
			defineChart({
				marks: [donut(kinds, { category: "kind", value: "missions" })],
			}),
			SIZE,
		);
		expect(
			findNearest(ring, focusStops(ring), x + width / 2 + 2, y + height / 2),
		).toBeNull();
	});
});

describe("radar", () => {
	it("draws the grid once and one polygon per series", () => {
		const rows = ["Vitesse", "Force", "Endurance"].flatMap((axis, index) => [
			{ axis, player: "A", score: 3 + index },
			{ axis, player: "B", score: 5 - index },
		]);
		const scene = compileChart(
			defineChart({
				marks: [radar(rows, { axis: "axis", value: "score", color: "player" })],
			}),
			SIZE,
		);
		expect(marks(scene)).toHaveLength(2);
		expect(
			flat(scene.nodes).filter((node) => node.role === "axis"),
		).toHaveLength(3);
		expect(scene.points).toHaveLength(6);
		expect(scene.legend.map((item) => item.label)).toEqual(["A", "B"]);
	});
});

describe("radialBar", () => {
	it("fills each ring in proportion to the max", () => {
		const scene = compileChart(
			defineChart({
				marks: [
					radialBar(kinds, { category: "kind", value: "missions", max: 40 }),
				],
			}),
			SIZE,
		);
		expect(marks(scene)).toHaveLength(3);
		expect(
			flat(scene.nodes).filter((node) => node.role === "track"),
		).toHaveLength(3);
	});
});

describe("funnel", () => {
	it("gives each step the conversion from the one before", () => {
		const scene = compileChart(
			defineChart({
				marks: [
					funnel(
						[
							{ step: "Visites", n: 1000 },
							{ step: "Inscriptions", n: 250 },
							{ step: "Missions", n: 50 },
						],
						{ category: "step", value: "n" },
					),
				],
			}),
			SIZE,
		);
		expect(scene.points.map((point) => plain(point.value))).toEqual([
			"1 000",
			"250 (25 %)",
			"50 (20 %)",
		]);
	});
});
