import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { defineChart } from "#/core/define-chart.ts";
import { barY } from "#/core/marks/bar.ts";
import { lineY } from "#/core/marks/line.ts";
import { Chart } from "#/react/chart.tsx";

let root: Root | null = null;
let host: HTMLDivElement | null = null;

async function mount(element: React.ReactNode) {
	host = document.createElement("div");
	host.style.width = "480px";
	document.body.append(host);
	root = createRoot(host);
	await act(async () => root?.render(element));
	return host;
}

function wait(ms: number) {
	return act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

/**
 * One reading per frame for `ms`, outside `act`: inside it React would hold
 * every frame's update back and only the last one would ever be seen.
 */
async function sample<T>(ms: number, read: () => T): Promise<T[]> {
	const scope = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
	scope.IS_REACT_ACT_ENVIRONMENT = false;
	const readings: T[] = [read()];
	const end = performance.now() + ms;
	while (performance.now() < end) {
		await new Promise((resolve) => requestAnimationFrame(resolve));
		readings.push(read());
	}
	scope.IS_REACT_ACT_ENVIRONMENT = true;
	return readings;
}

afterEach(async () => {
	await act(async () => root?.unmount());
	host?.remove();
	root = null;
	host = null;
});

describe("motion in the SVG renderer", () => {
	it("traces a line in on the first render, then leaves it whole", async () => {
		const container = await mount(
			<Chart
				ariaLabel="Missions"
				// Slow enough that a busy runner can't finish the draw before the first reading.
				animate={1500}
				definition={defineChart({
					marks: [lineY([4, 8, 6, 9], { enter: "draw", label: "Missions" })],
				})}
			/>,
		);
		const line = () =>
			container.querySelector("[data-slot=chart-svg] path[data-role=mark]");
		const offsets = await sample(4000, () => {
			const path = line();
			return path?.hasAttribute("pathLength")
				? Number(path.getAttribute("stroke-dashoffset"))
				: 0;
		});
		// Seen part-drawn on the way: a slow runner may miss the first frames, never all of them.
		expect(offsets.some((offset) => offset > 0.05 && offset < 0.95)).toBe(true);
		expect(line()?.hasAttribute("pathLength")).toBe(false);
	});

	it("keeps drawing a line in when the chart is resized mid-draw", async () => {
		const container = await mount(
			<Chart
				ariaLabel="Missions"
				animate={1500}
				definition={defineChart({
					marks: [lineY([4, 8, 6, 9], { enter: "draw", label: "Missions" })],
				})}
			/>,
		);
		const offset = () => {
			const path = container.querySelector(
				"[data-slot=chart-svg] path[data-role=mark]",
			);
			return path?.hasAttribute("pathLength")
				? Number(path.getAttribute("stroke-dashoffset"))
				: 0;
		};
		const before = await sample(300, offset);
		// The container measures again, as it does right after mount on a real page.
		container.style.width = "320px";
		const after = await sample(4000, offset);
		const readings = [...before, ...after].filter((value) => value > 0);
		// The draw only moves forward: a resize must not start it over.
		for (const [index, value] of readings.entries()) {
			expect(value).toBeLessThanOrEqual((readings[index - 1] ?? 1) + 1e-6);
		}
		expect(after.at(-1)).toBe(0);
	});

	it("grows a new bar from the baseline", async () => {
		function bars(values: number[]) {
			return defineChart({
				y: { domain: [0, 40] },
				marks: [
					barY(
						values.map((value, index) => ({ city: `c${index}`, value })),
						{ x: "city", y: "value", label: "Clubs", radius: 0 },
					),
				],
			});
		}
		const container = await mount(
			<Chart ariaLabel="Clubs" animate={1500} definition={bars([10, 20])} />,
		);
		// The width is measured after mount; a resize snaps, so let it land first.
		await wait(100);
		await act(async () =>
			root?.render(
				<Chart
					ariaLabel="Clubs"
					animate={1500}
					definition={bars([10, 20, 30])}
				/>,
			),
		);
		const third = () =>
			[
				...container.querySelectorAll("[data-slot=chart-svg] [data-role=mark]"),
			][2];
		const heights = await sample(
			4000,
			() => third()?.getBoundingClientRect().height ?? 0,
		);
		const settled = heights.at(-1) ?? 0;
		expect(settled).toBeGreaterThan(100);
		// Grown, not snapped: some frame showed it well short of its height.
		expect(heights.some((height) => height > 0 && height < settled * 0.6)).toBe(
			true,
		);
	});
});
