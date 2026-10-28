import { describe, expect, it } from "vitest";

import { tweenScene } from "#/core/motion/tween.ts";
import { DEFAULT_THEME } from "#/core/theme.ts";
import type { ChartScene, SceneNode } from "#/core/types.ts";

function scene(nodes: SceneNode[]): ChartScene {
	return {
		width: 100,
		height: 100,
		plot: { x: 0, y: 0, width: 100, height: 100 },
		nodes,
		points: [],
		legend: [],
		focusOrder: "x",
		scales: {},
		xLabel: "x",
		yLabel: "y",
		theme: DEFAULT_THEME,
		locale: "fr-FR",
	};
}

const bar = (height: number): SceneNode => ({
	kind: "rect",
	key: "bar",
	x: 10,
	y: 100 - height,
	width: 20,
	height,
	paint: { fill: "red" },
});

describe("tweenScene", () => {
	it("moves a node that is on both sides", () => {
		const middle = tweenScene(scene([bar(20)]), scene([bar(60)]), 0.5);
		expect(middle.nodes[0]).toMatchObject({ height: 40, y: 60 });
	});

	it("fades a new node in", () => {
		const extra: SceneNode = { ...bar(10), key: "new" };
		const middle = tweenScene(scene([bar(20)]), scene([bar(20), extra]), 0.25);
		expect(middle.nodes[1]).toMatchObject({ paint: { opacity: 0.25 } });
	});

	it("tweens a path point by point when only its numbers change", () => {
		const path = (d: string): SceneNode => ({
			kind: "path",
			key: "line",
			d,
			paint: {},
		});
		const middle = tweenScene(
			scene([path("M0,0L10,20")]),
			scene([path("M0,10L10,40")]),
			0.5,
		);
		expect(middle.nodes[0]).toMatchObject({ d: "M0,5L10,30" });
		const swapped = tweenScene(
			scene([path("M0,0L10,20")]),
			scene([path("M0,0L5,5L10,20")]),
			0.5,
		);
		expect(swapped.nodes[0]).toMatchObject({ d: "M0,0L10,20" });
	});

	it("is the target at the end", () => {
		const target = scene([bar(60)]);
		expect(tweenScene(scene([bar(20)]), target, 1)).toBe(target);
	});
});
