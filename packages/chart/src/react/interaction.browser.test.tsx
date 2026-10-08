import axe from "axe-core";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { brushX } from "#/brush/index.ts";
import { defineChart } from "#/core/define-chart.ts";
import { facet } from "#/core/facet.ts";
import { barY } from "#/core/marks/bar.ts";
import { lineY } from "#/core/marks/line.ts";
import { Chart } from "#/react/chart.tsx";

const series = Array.from({ length: 60 }, (_unused, index) => ({
	day: new Date(Date.UTC(2026, 0, 1 + index)),
	value: 10 + (index % 7) * 3,
}));
const lines = defineChart({
	marks: [lineY(series, { x: "day", y: "value", label: "Valeur" })],
});

let root: Root | null = null;
let host: HTMLDivElement | null = null;

async function mount(element: React.ReactNode) {
	host = document.createElement("div");
	host.style.width = "600px";
	document.body.append(host);
	root = createRoot(host);
	await act(async () => root?.render(element));
	return host;
}

afterEach(async () => {
	await act(async () => root?.unmount());
	host?.remove();
});

function surface(container: HTMLElement): HTMLElement {
	const element = container.querySelector("[data-slot=chart-surface]");
	if (!(element instanceof HTMLElement)) throw new Error("no surface");
	return element;
}

describe("zoom", () => {
	it("zooms with + while focused, says what it shows, and resets with 0", async () => {
		const container = await mount(
			<Chart definition={lines} ariaLabel="Valeur par jour" zoom />,
		);
		const ticks = () =>
			[...container.querySelectorAll("[data-role=axis]")]
				.map((node) => node.textContent)
				.join("|");
		const before = ticks();
		await userEvent.tab();
		await userEvent.keyboard("++");
		await expect
			.poll(() => container.querySelector("[data-slot=chart-reset-zoom]"))
			.not.toBeNull();
		// The labels the zoom drops fade out where they stood before they go.
		await expect.poll(ticks).not.toBe(before);
		await expect
			.poll(() => container.querySelector("[aria-live]")?.textContent ?? "")
			.toMatch(/^Affiché/);
		await userEvent.keyboard("0");
		await expect
			.poll(() => container.querySelector("[data-slot=chart-reset-zoom]"))
			.toBeNull();
		await expect.poll(ticks).toBe(before);
	});

	it("zooms with the wheel only while the chart has focus", async () => {
		const container = await mount(
			<Chart definition={lines} ariaLabel="Valeur" zoom />,
		);
		const chart = surface(container);
		const box = chart.getBoundingClientRect();
		const wheel = () =>
			chart.dispatchEvent(
				new WheelEvent("wheel", {
					deltaY: -100,
					clientX: box.left + box.width / 2,
					clientY: box.top + 50,
					bubbles: true,
					cancelable: true,
				}),
			);
		await act(async () => wheel());
		expect(container.querySelector("[data-slot=chart-reset-zoom]")).toBeNull();
		chart.focus();
		await act(async () => wheel());
		expect(
			container.querySelector("[data-slot=chart-reset-zoom]"),
		).not.toBeNull();
	});
});

describe("brush", () => {
	it("sets a range from the keyboard sliders and passes axe", async () => {
		const onBrush = vi.fn();
		const container = await mount(
			<Chart
				definition={defineChart({
					marks: [
						barY(
							["A", "B", "C", "D"].map((k, v) => ({ k, v: v + 1 })),
							{ x: "k", y: "v" },
						),
					],
				})}
				ariaLabel="Valeurs"
				brush={brushX({ onBrush })}
			/>,
		);
		const [start] = container.querySelectorAll<HTMLElement>("[role=slider]");
		start.focus();
		await userEvent.keyboard("{ArrowRight}");
		expect(onBrush).toHaveBeenLastCalledWith(["B", "D"]);
		expect(start.getAttribute("aria-valuetext")).toBe("B");
		const results = await axe.run(container);
		expect(results.violations.map((violation) => violation.id)).toEqual([]);
		await userEvent.keyboard("{Escape}");
		expect(onBrush).toHaveBeenLastCalledWith(null);
	});

	it("selects by dragging across the plot", async () => {
		const onBrush = vi.fn();
		const container = await mount(
			<Chart
				definition={lines}
				ariaLabel="Valeur"
				brush={brushX({ onBrush })}
			/>,
		);
		const chart = surface(container);
		const box = chart.getBoundingClientRect();
		const at = (share: number) => ({
			clientX: box.left + box.width * share,
			clientY: box.top + 80,
			pointerId: 1,
			bubbles: true,
		});
		await act(async () => {
			chart.dispatchEvent(new PointerEvent("pointerdown", at(0.3)));
			chart.dispatchEvent(new PointerEvent("pointermove", at(0.5)));
			chart.dispatchEvent(new PointerEvent("pointermove", at(0.6)));
			chart.dispatchEvent(new PointerEvent("pointerup", at(0.6)));
		});
		const [from, to] = onBrush.mock.lastCall?.[0] ?? [];
		expect(from).toBeInstanceOf(Date);
		expect(to.getTime()).toBeGreaterThan(from.getTime());
		expect(
			container.querySelector("[data-slot=chart-brush-selection]"),
		).not.toBeNull();
	});

	it("selects no text and hides the tooltip while dragging", async () => {
		const container = await mount(
			<Chart
				definition={lines}
				ariaLabel="Valeur"
				brush={brushX({ onBrush: () => {} })}
			/>,
		);
		const chart = surface(container);
		const box = chart.getBoundingClientRect();
		await userEvent.hover(chart, { position: { x: box.width * 0.5, y: 80 } });
		await expect
			.poll(() => container.querySelector("[data-slot=chart-tooltip]"))
			.not.toBeNull();
		await userEvent.dragAndDrop(chart, chart, {
			sourcePosition: { x: box.width * 0.2, y: 80 },
			targetPosition: { x: box.width * 0.7, y: 120 },
		});
		expect(window.getSelection()?.toString() ?? "").toBe("");
		expect(
			container.querySelector("[data-slot=chart-brush-selection]"),
		).not.toBeNull();
		expect(container.querySelector("[data-slot=chart-tooltip]")).toBeNull();
	});
});

describe("facets", () => {
	it("draws one titled cell per value and passes axe", async () => {
		const rows = ["Nantes", "Lyon"].flatMap((city, index) =>
			["Jan", "Feb"].map((month, step) => ({
				city,
				month,
				n: index * 10 + step,
			})),
		);
		const container = await mount(
			<Chart
				ariaLabel="Missions par ville"
				definition={defineChart({
					facet: facet({
						values: ["Nantes", "Lyon"],
						marks: (city) => [
							barY(
								rows.filter((row) => row.city === city),
								{ x: "month", y: "n" },
							),
						],
					}),
				})}
			/>,
		);
		const titles = [
			...container.querySelectorAll("[data-role=facet-title]"),
		].map((node) => node.textContent);
		expect(titles).toEqual(["Nantes", "Lyon"]);
		await userEvent.tab();
		await expect
			.poll(() => container.querySelector("[aria-live]")?.textContent)
			.toMatch(/^Nantes · Jan/);
		const results = await axe.run(container);
		expect(results.violations.map((violation) => violation.id)).toEqual([]);
	});
});
