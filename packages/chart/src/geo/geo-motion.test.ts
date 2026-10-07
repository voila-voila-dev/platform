import { describe, expect, it } from "vitest";
import { compileChart } from "#/core/compile.ts";
import { defineChart } from "#/core/define-chart.ts";
import { createMotionStore } from "#/core/motion/motion-store.ts";
import { type ChartTiming, chartTiming } from "#/core/motion/timing.ts";
import type { ChartScene, SceneNode } from "#/core/types.ts";
import { geoShape, projection } from "#/geo/geo.ts";

type Ring = ReadonlyArray<readonly [number, number]>;

function region(name: string, ring: Ring, missions: number) {
	return {
		type: "Feature" as const,
		properties: { name, missions },
		geometry: { type: "Polygon", coordinates: [ring] },
	};
}

const square: Ring = [
	[0, 45],
	[0, 46],
	[1, 46],
	[1, 45],
	[0, 45],
];
// The same region redrawn with one more vertex: its path has more commands.
const pentagon: Ring = [
	[0, 45],
	[0, 46],
	[0.5, 46.4],
	[1, 46],
	[1, 45],
	[0, 45],
];

function map(ring: Ring, missions: number): ChartScene {
	const regions = [
		region("Ouest", ring, missions),
		region(
			"Est",
			square.map(([x, y]) => [x + 2, y] as const),
			20,
		),
	];
	return compileChart(
		defineChart({
			projection: projection("mercator", {
				domain: { type: "FeatureCollection", features: regions } as never,
			}),
			marks: [
				geoShape(regions, {
					name: (feature) => feature.properties.name,
					color: (feature) => feature.properties.missions,
					label: "Missions",
				}),
			],
		}),
		{ width: 400, height: 200 },
	);
}

function ouest(scene: ChartScene): Extract<SceneNode, { kind: "path" }> {
	const walk = (nodes: readonly SceneNode[]): SceneNode[] =>
		nodes.flatMap((node) =>
			node.kind === "group" ? walk(node.children) : [node],
		);
	return walk(scene.nodes).find((node) =>
		node.key.endsWith(":Ouest"),
	) as Extract<SceneNode, { kind: "path" }>;
}

const VALID_PATH = /^M[-\d.,\sMLZ]+$/;

describe("a map update", () => {
	const timing = chartTiming({
		type: "tween",
		duration: 400,
		easing: "linear",
	}) as ChartTiming;

	it("morphs a region whose outline changed shape instead of swapping it", () => {
		const before = map(square, 10);
		const after = map(pentagon, 10);
		const store = createMotionStore(before, timing);
		store.retarget(after, 0);
		const frames = [50, 150, 250, 350].map((now) => ouest(store.frame(now)).d);
		for (const d of frames) {
			expect(d).toMatch(VALID_PATH);
			expect(d).not.toBe(ouest(before).d);
			expect(d).not.toBe(ouest(after).d);
		}
		expect(new Set(frames).size).toBe(frames.length);
		expect(ouest(store.frame(400)).d).toBe(ouest(after).d);
	});

	it("leaves an unchanged region exactly as it is", () => {
		const scene = map(square, 10);
		const store = createMotionStore(scene, timing);
		store.retarget(map(square, 10), 0);
		expect(ouest(store.frame(200)).d).toBe(ouest(scene).d);
	});

	it("tints a region whose value changed through color-mix", () => {
		const before = map(square, 10);
		const after = map(square, 40);
		const store = createMotionStore(before, timing);
		store.retarget(after, 0);
		const fill = ouest(store.frame(200)).paint.fill;
		expect(fill).toMatch(/^color-mix\(in oklab, .+ 50%, .+\)$/);
		expect(ouest(store.frame(400)).paint.fill).toBe(ouest(after).paint.fill);
	});
});
