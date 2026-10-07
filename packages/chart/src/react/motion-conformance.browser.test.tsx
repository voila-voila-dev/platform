import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { commands, userEvent } from "vitest/browser";
import { CanvasRenderer } from "#/canvas/index.ts";
import { compileChart } from "#/core/compile.ts";
import { defineChart } from "#/core/define-chart.ts";
import { barY } from "#/core/marks/bar.ts";
import { lineY } from "#/core/marks/line.ts";
import { createMotionStore } from "#/core/motion/motion-store.ts";
import { type ChartTiming, chartTiming } from "#/core/motion/timing.ts";
import type { ChartScene, SceneNode } from "#/core/types.ts";
import { Chart } from "#/react/chart.tsx";
import type { ChartRendererProps } from "#/react/renderer.ts";

let root: Root | null = null;
let host: HTMLDivElement | null = null;

async function mount(element: React.ReactNode) {
	host = document.createElement("div");
	host.style.width = "480px";
	document.body.append(host);
	root = createRoot(host);
	await act(async () => root?.render(element));
	// The measured width lands after the first paint; an update before it would snap as a resize.
	await wait(50);
	return host;
}

async function update(element: React.ReactNode) {
	await act(async () => root?.render(element));
}

function wait(ms: number) {
	return act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

/**
 * Real time with React committing each frame as it comes. Inside `act`,
 * React would hold every frame's update back until the scope ends, and the
 * renderer would only ever see the first and the last.
 */
async function watch(ms: number) {
	const scope = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
	scope.IS_REACT_ACT_ENVIRONMENT = false;
	await new Promise((resolve) => setTimeout(resolve, ms));
	scope.IS_REACT_ACT_ENVIRONMENT = true;
}

afterEach(async () => {
	await act(async () => root?.unmount());
	host?.remove();
	root = null;
	host = null;
	await commands.emulateMedia({ reducedMotion: null });
});

const cities = ["Paris", "Lyon", "Nantes", "Lille", "Bordeaux"];

function bars(values: readonly number[]) {
	return defineChart({
		y: { domain: [0, 100] },
		marks: [
			barY(
				values.map((value, index) => ({ city: cities[index], value })),
				{ x: "city", y: "value", label: "Clubs", radius: 0 },
			),
		],
	});
}

function marks(scene: ChartScene): SceneNode[] {
	const all: SceneNode[] = [];
	function walk(nodes: readonly SceneNode[]) {
		for (const node of nodes) {
			if (node.kind === "group") walk(node.children);
			else if (node.role === "mark") all.push(node);
		}
	}
	walk(scene.nodes);
	return all;
}

function heights(scene: ChartScene): number[] {
	return marks(scene).map((node) => (node.kind === "rect" ? node.height : 0));
}

/** The largest change of any bar between two consecutive frames. */
function largestStep(frames: readonly number[][]): number {
	let largest = 0;
	for (let index = 1; index < frames.length; index += 1) {
		const previous = frames[index - 1] ?? [];
		for (const [bar, height] of (frames[index] ?? []).entries()) {
			largest = Math.max(largest, Math.abs(height - (previous[bar] ?? height)));
		}
	}
	return largest;
}

const LOW = [10, 20, 30, 40, 50];
const HIGH = [90, 80, 70, 60, 50];
const MIDDLE = [40, 60, 20, 80, 30];

/** Slow enough that a frame dropped on a busy runner moves a bar by a small part of its travel. */
const SLOW = 1500;

/** Sample every frame the renderer is handed through an update interrupted by another. */
async function interruptedFrames(
	renderer: "svg" | "canvas",
): Promise<{ frames: number[][]; travel: number }> {
	const scenes: ChartScene[] = [];
	function Recording(props: ChartRendererProps) {
		scenes.push(props.scene);
		return <CanvasRenderer {...props} />;
	}
	const container = await mount(
		<Chart
			definition={bars(LOW)}
			ariaLabel="Clubs"
			animate={SLOW}
			renderer={renderer === "canvas" ? Recording : undefined}
		/>,
	);
	const svgFrames: number[][] = [];
	let sampling = true;
	function sample() {
		const rects = container.querySelectorAll(
			"[data-slot=chart-svg] rect[data-role=mark]",
		);
		svgFrames.push(
			[...rects].map((rect) => Number(rect.getAttribute("height"))),
		);
		if (sampling) requestAnimationFrame(sample);
	}
	const start = scenes.length;
	if (renderer === "svg") requestAnimationFrame(sample);
	await update(
		<Chart
			definition={bars(HIGH)}
			ariaLabel="Clubs"
			animate={SLOW}
			renderer={renderer === "canvas" ? Recording : undefined}
		/>,
	);
	await watch(300);
	await update(
		<Chart
			definition={bars(MIDDLE)}
			ariaLabel="Clubs"
			animate={SLOW}
			renderer={renderer === "canvas" ? Recording : undefined}
		/>,
	);
	await watch(4000);
	sampling = false;
	const frames =
		renderer === "svg" ? svgFrames : scenes.slice(start).map(heights);
	const all = frames.flat();
	return { frames, travel: Math.max(...all) - Math.min(...all) };
}

describe("an update interrupted by another", () => {
	for (const renderer of ["svg", "canvas"] as const) {
		it(`moves without a jump on ${renderer}`, async () => {
			const { frames, travel } = await interruptedFrames(renderer);
			expect(frames.length).toBeGreaterThan(20);
			expect(travel).toBeGreaterThan(0);
			// A restart from the old start or a snap to the target moves a bar by most of its travel at once;
			// at 1.5 s a spring covers a few percent of it per frame, still well under a third with dropped frames.
			expect(largestStep(frames)).toBeLessThan(travel * 0.35);
		});
	}
});

describe("reduced motion on canvas", () => {
	it("hands the renderer the new scene at once", async () => {
		await commands.emulateMedia({ reducedMotion: "reduce" });
		const scenes: ChartScene[] = [];
		function Recording(props: ChartRendererProps) {
			scenes.push(props.scene);
			return <CanvasRenderer {...props} />;
		}
		await mount(
			<Chart definition={bars(LOW)} ariaLabel="Clubs" renderer={Recording} />,
		);
		const start = scenes.length;
		await update(
			<Chart definition={bars(HIGH)} ariaLabel="Clubs" renderer={Recording} />,
		);
		await watch(300);
		const after = scenes.slice(start).map((scene) => heights(scene).join());
		const target = after.at(-1);
		// Nothing in between: the render that carries the update may still hold the old scene until the layout effect swaps it, before paint.
		expect(new Set(after).size).toBeLessThanOrEqual(2);
		expect(
			after.filter((frame) => frame !== target).length,
		).toBeLessThanOrEqual(1);
		expect(target).not.toBe(heights(scenes[start - 1] as ChartScene).join());
	});
});

describe("focus during motion", () => {
	it("reads the data being moved towards", async () => {
		const container = await mount(
			<Chart definition={bars(LOW)} ariaLabel="Clubs" animate={2000} />,
		);
		await update(
			<Chart definition={bars(HIGH)} ariaLabel="Clubs" animate={2000} />,
		);
		await watch(100);
		const surface = container.querySelector<HTMLElement>("[tabindex='0']");
		surface?.focus();
		await userEvent.keyboard("{Home}");
		await wait(50);
		// The first bar is still low on screen, but the reader hears its new value.
		expect(container.textContent).toContain("90");
		expect(container.textContent).not.toContain("Paris : 10");
	});
});

describe("zoom", () => {
	const daily = defineChart({
		marks: [
			lineY(
				Array.from({ length: 60 }, (_unused, index) => ({
					day: new Date(Date.UTC(2026, 0, 1 + index)),
					value: 20 + (index % 9),
				})),
				{ x: "day", y: "value", label: "Valeur" },
			),
		],
	});

	it("springs a keyboard zoom step", async () => {
		const container = await mount(
			<Chart definition={daily} ariaLabel="Valeur" zoom animate={600} />,
		);
		const line = () =>
			container
				.querySelector("[data-slot=chart-svg] path[data-role=mark]")
				?.getAttribute("d");
		const surface = container.querySelector<HTMLElement>("[tabindex='0']");
		surface?.focus();
		const before = line();
		await userEvent.keyboard("+");
		await watch(60);
		const during = line();
		await watch(1500);
		const after = line();
		expect(during).not.toBe(before);
		expect(during).not.toBe(after);
	});
});

describe("the 1,000-point benchmark", () => {
	it("builds a frame of a 1,000-point line update well within 16 ms", () => {
		function scene(shift: number): ChartScene {
			return compileChart(
				defineChart({
					marks: [
						lineY(
							Array.from({ length: 1000 }, (_unused, index) => ({
								x: index,
								y: Math.sin((index + shift) / 40) * 50,
							})),
							{ x: "x", y: "y", label: "Signal" },
						),
					],
				}),
				{ width: 800, height: 300 },
			);
		}
		const store = createMotionStore(scene(0), chartTiming(true) as ChartTiming);
		store.retarget(scene(30), 0);
		// Warm the JIT first, then time many frames: a shared CI runner is noisy, one frame tells nothing.
		for (let now = 0; now < 500; now += 1000 / 60) store.frame(now);
		const durations: number[] = [];
		for (let round = 0; round < 5; round += 1) {
			for (let now = 0; now < 500; now += 1000 / 60) {
				const start = performance.now();
				store.frame(now);
				durations.push(performance.now() - start);
			}
		}
		durations.sort((a, b) => a - b);
		const median = durations[Math.floor(durations.length / 2)] ?? 0;
		console.log(
			`1,000-point frame: median ${median.toFixed(2)} ms, worst ${durations.at(-1)?.toFixed(2)} ms`,
		);
		// The frame budget at 60 fps: the store alone must leave the renderer most of it.
		expect(median).toBeLessThan(16);
	});
});
