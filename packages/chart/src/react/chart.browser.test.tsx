import axe from "axe-core";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";

import { CanvasRenderer } from "#/canvas/canvas-renderer.tsx";
import { defineChart } from "#/core/define-chart.ts";
import { barY } from "#/core/marks/bar.ts";
import { lineY } from "#/core/marks/line.ts";
import { Chart } from "#/react/chart.tsx";
import type { ChartRenderer } from "#/react/renderer.ts";
import { SvgRenderer } from "#/react/svg-renderer.tsx";

const rows = [
	{ month: "Jan", club: 12, pro: 8 },
	{ month: "Feb", club: 18, pro: 11 },
	{ month: "Mar", club: 15, pro: 14 },
];

const bars = defineChart({
	marks: [
		barY(rows, {
			x: "month",
			y: "club",
			fill: "rgb(255, 0, 0)",
			label: "Clubs",
		}),
	],
});

const lines = defineChart({
	marks: [
		lineY(rows, { x: "month", y: "club", label: "Clubs" }),
		lineY(rows, { x: "month", y: "pro", label: "Pros" }),
	],
});

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

afterEach(async () => {
	await act(async () => root?.unmount());
	host?.remove();
	root = null;
	host = null;
});

describe.each<[string, ChartRenderer]>([
	["svg", SvgRenderer],
	["canvas", CanvasRenderer],
])("Chart with the %s renderer", (_name, renderer) => {
	it("passes axe", async () => {
		const container = await mount(
			<Chart
				definition={lines}
				ariaLabel="Clubs et pros par mois"
				renderer={renderer}
			/>,
		);
		const results = await axe.run(container);
		expect(results.violations.map((violation) => violation.id)).toEqual([]);
	});

	it("is reached with Tab and walked with the arrows", async () => {
		const container = await mount(
			<Chart
				definition={lines}
				ariaLabel="Clubs et pros"
				renderer={renderer}
			/>,
		);
		await userEvent.tab();
		const surface = container.querySelector("[data-slot=chart-surface]");
		expect(document.activeElement).toBe(surface);
		await expect
			.poll(() => container.querySelector("[aria-live]")?.textContent)
			.toBe("Jan : Clubs 12, Pros 8");
		await userEvent.keyboard("{ArrowRight}");
		await expect
			.poll(() => container.querySelector("[aria-live]")?.textContent)
			.toBe("Feb : Clubs 18, Pros 11");
		expect(
			container.querySelector("[data-slot=chart-focus-ring]"),
		).not.toBeNull();
	});

	it("shows the same tooltip for the same pointer position", async () => {
		const container = await mount(
			<Chart definition={bars} ariaLabel="Clubs" renderer={renderer} />,
		);
		const surface = container.querySelector("[data-slot=chart-surface]");
		if (!(surface instanceof HTMLElement)) throw new Error("no surface");
		const box = surface.getBoundingClientRect();
		await act(async () => {
			surface.dispatchEvent(
				new PointerEvent("pointermove", {
					bubbles: true,
					clientX: box.left + box.width / 2,
					clientY: box.top + box.height / 2,
				}),
			);
		});
		expect(
			container.querySelector("[data-slot=chart-tooltip]")?.textContent,
		).toBe("FebClubs18");
	});
});

describe("CanvasRenderer", () => {
	it("paints the bars in their resolved colour", async () => {
		const container = await mount(
			<Chart definition={bars} ariaLabel="Clubs" renderer={CanvasRenderer} />,
		);
		const canvas = container.querySelector("canvas");
		if (!(canvas instanceof HTMLCanvasElement)) throw new Error("no canvas");
		const context = canvas.getContext("2d");
		const ratio = window.devicePixelRatio || 1;
		const box = canvas.getBoundingClientRect();
		// The middle bar's body, well below its rounded top.
		const pixel = context?.getImageData(
			Math.round((box.width / 2) * ratio),
			Math.round(box.height * 0.8 * ratio),
			1,
			1,
		).data;
		expect([...(pixel ?? [])]).toEqual([255, 0, 0, 255]);
	});

	it("resolves CSS variables, which a canvas cannot read itself", async () => {
		const container = await mount(
			<div style={{ ["--chart-1" as string]: "rgb(0, 128, 0)" }}>
				<Chart
					definition={defineChart({
						marks: [barY(rows, { x: "month", y: "club" })],
					})}
					ariaLabel="Clubs"
					renderer={CanvasRenderer}
				/>
			</div>,
		);
		const canvas = container.querySelector("canvas");
		if (!(canvas instanceof HTMLCanvasElement)) throw new Error("no canvas");
		const ratio = window.devicePixelRatio || 1;
		const box = canvas.getBoundingClientRect();
		const pixel = canvas
			.getContext("2d")
			?.getImageData(
				Math.round((box.width / 2) * ratio),
				Math.round(box.height * 0.8 * ratio),
				1,
				1,
			).data;
		expect([...(pixel ?? [])]).toEqual([0, 128, 0, 255]);
	});
});
