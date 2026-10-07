import { describe, expect, it } from "vitest";
import { createMotionStore } from "#/core/motion/motion-store.ts";
import { type ChartTiming, chartTiming } from "#/core/motion/timing.ts";
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

function bar(height: number, key = "bar"): SceneNode {
	return {
		kind: "rect",
		key,
		role: "mark",
		x: 10,
		y: 100 - height,
		width: 20,
		height,
		paint: { fill: "red" },
	};
}

function heightAt(frame: ChartScene, index = 0): number {
	return (frame.nodes[index] as { height: number }).height;
}

const spring = chartTiming(true) as ChartTiming;

function run(timing: ChartTiming, from: number, to: number) {
	const store = createMotionStore(scene([bar(from)]), timing);
	store.retarget(scene([bar(to)]), 0);
	const heights: number[] = [];
	for (let now = 0; !store.settled(now); now += 1000 / 60) {
		heights.push(heightAt(store.frame(now)));
	}
	return { store, heights };
}

describe("createMotionStore", () => {
	it("springs to the target and then hands back the target scene itself", () => {
		const target = scene([bar(60)]);
		const store = createMotionStore(scene([bar(20)]), spring);
		store.retarget(target, 0);
		expect(heightAt(store.frame(100))).toBeGreaterThan(20);
		expect(heightAt(store.frame(100))).toBeLessThan(60);
		expect(store.settled(5000)).toBe(true);
		expect(store.frame(5000)).toBe(target);
	});

	it("never overshoots with no bounce, and does with some", () => {
		expect(Math.max(...run(spring, 20, 60).heights)).toBeLessThanOrEqual(60);
		const bouncy = chartTiming({ bounce: 0.4 }) as ChartTiming;
		expect(Math.max(...run(bouncy, 20, 60).heights)).toBeGreaterThan(61);
	});

	it("keeps each node's speed when an update lands mid-flight", () => {
		const store = createMotionStore(scene([bar(0)]), spring);
		store.retarget(scene([bar(100)]), 0);
		const step = 1;
		const at = 120;
		const before = heightAt(store.frame(at)) - heightAt(store.frame(at - step));
		store.retarget(scene([bar(200)]), at);
		const after = heightAt(store.frame(at + step)) - heightAt(store.frame(at));
		// Same speed on both sides of the retarget, by 1 ms finite differences: no kink, no restart from rest.
		expect(after).toBeGreaterThan(before * 0.95);
		expect(after).toBeLessThan(before * 1.05);
		expect(heightAt(store.frame(at))).toBeCloseTo(
			heightAt(createMotionStoreAt(at)),
			5,
		);
	});

	it("fades a new node in and drops a node that left", () => {
		const store = createMotionStore(
			scene([bar(20, "a"), bar(20, "gone")]),
			spring,
		);
		store.retarget(scene([bar(20, "a"), bar(30, "new")]), 0);
		const frame = store.frame(50);
		expect(frame.nodes.map((node) => node.key)).toEqual(["a", "new"]);
		const opacity =
			(frame.nodes[1] as { paint: { opacity?: number } }).paint.opacity ?? 1;
		expect(opacity).toBeGreaterThan(0);
		expect(opacity).toBeLessThan(1);
	});

	it("staggers marks in order, within 300 ms in all", () => {
		const timing = chartTiming({ stagger: 100 }) as ChartTiming;
		const nodes = (height: number) =>
			Array.from({ length: 5 }, (_unused, index) => bar(height, `bar${index}`));
		const store = createMotionStore(scene(nodes(0)), timing);
		store.retarget(scene(nodes(50)), 0);
		const frame = store.frame(100);
		expect(heightAt(frame, 0)).toBeGreaterThan(0);
		expect(heightAt(frame, 4)).toBe(0);
		expect(heightAt(store.frame(310), 4)).toBeGreaterThan(0);
	});

	it("snaps", () => {
		const store = createMotionStore(scene([bar(20)]), spring);
		store.retarget(scene([bar(60)]), 0);
		const resized = scene([bar(80)]);
		store.snap(resized);
		expect(store.frame(10)).toBe(resized);
	});
});

/** The same store, never interrupted: where the first motion stood at `at`. */
function createMotionStoreAt(at: number): ChartScene {
	const store = createMotionStore(scene([bar(0)]), spring);
	store.retarget(scene([bar(100)]), 0);
	return store.frame(at);
}
