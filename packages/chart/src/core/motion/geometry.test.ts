import { describe, expect, it } from "vitest";
import { compileChart } from "#/core/compile.ts";
import { defineChart } from "#/core/define-chart.ts";
import { areaY } from "#/core/marks/area.ts";
import { barY } from "#/core/marks/bar.ts";
import { lineY } from "#/core/marks/line.ts";
import { arc } from "#/core/marks/polar.ts";
import { createMotionStore } from "#/core/motion/motion-store.ts";
import { type ChartTiming, chartTiming } from "#/core/motion/timing.ts";
import type {
	ChartMark,
	ChartScene,
	SceneGeometry,
	SceneNode,
	ScenePath,
	SceneRect,
} from "#/core/types.ts";

const SIZE = { width: 400, height: 300 };
const FRAME = 1000 / 60;
const spring = chartTiming(true) as ChartTiming;

function compile(
	marks: ChartMark[],
	y?: readonly [number, number],
): ChartScene {
	return compileChart(
		defineChart({ marks, ...(y ? { y: { domain: y } } : {}) }),
		SIZE,
	);
}

function flat(nodes: ReadonlyArray<SceneNode>): SceneNode[] {
	return nodes.flatMap((node) =>
		node.kind === "group" ? flat(node.children) : [node],
	);
}

function marks<T extends SceneNode>(scene: ChartScene): T[] {
	return flat(scene.nodes).filter((node) => node.role === "mark") as T[];
}

/** Every frame from `from` to `to`, until the store settles. */
function frames(from: ChartScene, to: ChartScene): ChartScene[] {
	const store = createMotionStore(from, spring);
	store.retarget(to, 0);
	const all: ChartScene[] = [];
	for (let now = 0; !store.settled(now); now += FRAME)
		all.push(store.frame(now));
	all.push(store.frame(Number.MAX_SAFE_INTEGER));
	return all;
}

/** Commands of a path, by letter: "M", "L", "C"… */
function commands(d: string): string[] {
	return d.match(/[MLCAZHV]/g) ?? [];
}

function points(geometry: SceneGeometry | undefined) {
	return geometry?.kind === "points" ? geometry.runs.flat() : [];
}

const months = (from: number, count: number, curve?: "monotone") =>
	lineY(
		Array.from({ length: count }, (_unused, index) => ({
			month: from + index,
			value: 10 + ((from + index) % 4) * 5,
		})),
		{ x: "month", y: "value", id: "line", curve },
	);

describe("lines keyed by x", () => {
	it("slides a shifted window instead of swapping, every frame a valid curve", () => {
		const before = compile([months(0, 6, "monotone")], [0, 40]);
		const after = compile([months(1, 6, "monotone")], [0, 40]);
		const all = frames(before, after);
		const xs = (scene: ChartScene, key: string) =>
			points(marks<ScenePath>(scene)[0]?.geometry).find(
				(point) => point.key === key,
			)?.x;
		const start = xs(before, "3") as number;
		const end = xs(after, "3") as number;
		expect(end).toBeLessThan(start);
		const middle = xs(
			all[Math.floor(all.length / 3)] as ChartScene,
			"3",
		) as number;
		expect(middle).toBeLessThan(start);
		expect(middle).toBeGreaterThan(end);
		for (const scene of all) {
			const [line] = marks<ScenePath>(scene);
			const count = points(line?.geometry).length;
			const letters = commands(line?.d ?? "");
			expect(letters[0]).toBe("M");
			expect(letters.filter((letter) => letter === "C")).toHaveLength(
				count - 1,
			);
			expect(line?.d).not.toMatch(/NaN|undefined/);
		}
		expect(marks<ScenePath>(all.at(-1) as ChartScene)[0]?.d).toBe(
			marks<ScenePath>(after)[0]?.d,
		);
	});

	it("enters a new point from the last old one and folds a dropped one into its neighbour", () => {
		const before = compile([months(0, 4)], [0, 40]);
		const after = compile([months(1, 4)], [0, 40]);
		const [first] = frames(before, after);
		const geometry = points(marks<ScenePath>(first as ChartScene)[0]?.geometry);
		const old = points(marks<ScenePath>(before)[0]?.geometry);
		expect(geometry.map((point) => point.key)).toEqual([
			"0",
			"1",
			"2",
			"3",
			"4",
		]);
		const entering = geometry.find((point) => point.key === "4");
		const last = old.find((point) => point.key === "3");
		expect(entering?.x).toBeCloseTo(last?.x as number);
		expect(entering?.y).toBeCloseTo(last?.y as number);
	});
});

describe("areas", () => {
	it("grow a new series from its lower edge", () => {
		const data = [1, 2, 3].map((month) => ({ month, value: 20 }));
		const before = compile([], [0, 40]);
		const after = compile(
			[areaY(data, { x: "month", y: "value", id: "area" })],
			[0, 40],
		);
		const [first] = frames(before, after);
		const area = points(marks<ScenePath>(first as ChartScene)[0]?.geometry);
		for (const point of area) expect(point.y).toBeCloseTo(point.y0 as number);
	});
});

describe("bars", () => {
	const bars = (values: number[]) =>
		barY(
			values.map((value, index) => ({ city: `c${index}`, value })),
			{ x: "city", y: "value", id: "bars" },
		);

	it("grow from the baseline and shrink back to it on the way out", () => {
		const before = compile([bars([10, 20])], [0, 40]);
		const after = compile([bars([10, 20, 30])], [0, 40]);
		const all = frames(before, after);
		const entering = (scene: ChartScene) =>
			marks<SceneRect>(scene).find((node) => node.key.endsWith(":2"));
		const base = entering(after)?.baseline?.at as number;
		expect(entering(all[0] as ChartScene)?.height).toBeCloseTo(0);
		expect(entering(all[0] as ChartScene)?.y).toBeCloseTo(base);
		const heights = all.map((scene) => entering(scene)?.height ?? 0);
		expect(heights.at(-1)).toBeCloseTo(entering(after)?.height as number);

		const out = frames(after, before);
		const leaving = out.map((scene) => entering(scene));
		expect(leaving[1]?.height).toBeGreaterThan(0);
		expect(leaving[1]?.height).toBeLessThan(entering(after)?.height as number);
		expect(leaving.at(-1)).toBeUndefined();
		// Hit-testing reads the target scene, which never holds the leaving bar.
		expect(marks(before).some((node) => node.key.endsWith(":2"))).toBe(false);
	});
});

describe("slices", () => {
	const pie = (values: number[], padAngle = 0) =>
		arc(
			values.map((value, index) => ({ kind: `k${index}`, value })),
			{ category: "kind", value: "value", id: "pie", padAngle },
		);

	function slices(scene: ChartScene) {
		return marks<ScenePath>(scene)
			.map((node) => node.geometry)
			.filter((geometry) => geometry?.kind === "arc")
			.sort((a, b) => a.startAngle - b.startAngle);
	}

	/** Unpadded slices tile the circle exactly: each starts where the one before ends. */
	function check(scene: ChartScene) {
		let cursor = 0;
		for (const slice of slices(scene)) {
			expect(slice.endAngle).toBeGreaterThanOrEqual(slice.startAngle - 1e-9);
			expect(slice.startAngle).toBeCloseTo(cursor, 6);
			cursor = slice.endAngle;
		}
		expect(cursor).toBeCloseTo(360, 6);
	}

	it("keep padded slices apart and in order on every frame", () => {
		for (const scene of frames(
			compile([pie([30, 30, 40], 2)]),
			compile([pie([30, 40], 2)]),
		)) {
			let cursor = 0;
			for (const slice of slices(scene)) {
				expect(slice.startAngle).toBeGreaterThanOrEqual(cursor - 1e-9);
				expect(slice.endAngle).toBeGreaterThanOrEqual(slice.startAngle - 1e-9);
				cursor = slice.endAngle;
			}
			expect(cursor).toBeLessThanOrEqual(360);
		}
	});

	it("open a new slice and close a removed one, tiling the circle on every frame", () => {
		const three = compile([pie([30, 30, 40])]);
		const four = compile([pie([30, 30, 40, 50])]);
		const opening = frames(three, four);
		for (const scene of opening) check(scene);
		const middle = opening[Math.floor(opening.length / 3)] as ChartScene;
		expect(marks(middle)).toHaveLength(4);

		const closing = frames(four, three);
		for (const scene of closing) check(scene);
		expect(marks(closing[1] as ChartScene)).toHaveLength(4);
		expect(marks(closing.at(-1) as ChartScene)).toHaveLength(3);
	});

	it("redraws every frame through the arc builder: one A per edge, no flag ever wrong", () => {
		const all = frames(compile([pie([10, 90])]), compile([pie([90, 10])]));
		for (const scene of all) {
			for (const slice of marks<ScenePath>(scene)) {
				const geometry = slice.geometry as Extract<
					SceneGeometry,
					{ kind: "arc" }
				>;
				const sweep = geometry.endAngle - geometry.startAngle;
				const flag = slice.d.match(/A[\d.]+,[\d.]+ 0 (\d)/)?.[1];
				if (sweep > 0 && sweep < 360)
					expect(flag).toBe(sweep > 180 ? "1" : "0");
			}
		}
	});
});

describe("draw", () => {
	it("traces a line in on the first render", () => {
		const scene = compile(
			[lineY([1, 3, 2], { id: "line", enter: "draw" })],
			[0, 4],
		);
		const store = createMotionStore(scene, spring);
		expect(store.introduce(0)).toBe(true);
		const early = marks<ScenePath>(store.frame(FRAME))[0]?.paint.drawn;
		expect(early?.fraction).toBeGreaterThan(0);
		expect(early?.fraction).toBeLessThan(1);
		expect(early?.length).toBeGreaterThan(0);
		expect(
			marks<ScenePath>(store.frame(10_000))[0]?.paint.drawn,
		).toBeUndefined();
	});

	it("doesn't draw a line that never asked to", () => {
		const scene = compile([lineY([1, 3, 2], { id: "line" })], [0, 4]);
		expect(createMotionStore(scene, spring).introduce(0)).toBe(false);
	});
});

describe("geometry and colour together", () => {
	it("moves a slice's angles and mixes its new fill on the same frames", () => {
		const pie = (fill: string, values: number[]) =>
			arc(
				values.map((value, index) => ({ kind: `k${index}`, value })),
				{ category: "kind", value: "value", id: "pie", padAngle: 0, fill },
			);
		const all = frames(
			compile([pie("var(--chart-1)", [10, 90])]),
			compile([pie("var(--chart-2)", [90, 10])]),
		);
		const middle = marks<ScenePath>(
			all[Math.floor(all.length / 4)] as ChartScene,
		)[0];
		expect(middle?.paint.fill).toMatch(
			/^color-mix\(in oklab, var\(--chart-2\)/,
		);
		const angle = (
			(middle as ScenePath).geometry as Extract<SceneGeometry, { kind: "arc" }>
		).endAngle;
		expect(angle).toBeGreaterThan(36);
		expect(angle).toBeLessThan(324);
	});
});
