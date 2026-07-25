// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Chart, type ChartConfig } from "#/chart/components/chart.tsx";

afterEach(cleanup);

const config: ChartConfig = {
	projects: { label: "Projects published", color: "var(--chart-1)" },
	bookings: { label: "Bookings confirmed", color: "var(--chart-2)" },
};

const data = [
	{ month: "January", projects: 24, bookings: 18 },
	{ month: "February", projects: 31, bookings: 22 },
	{ month: "March", projects: 28, bookings: 25 },
];

const slots = (slot: string): HTMLElement[] =>
	Array.from(document.querySelectorAll<HTMLElement>(`[data-slot="${slot}"]`));

const slot = (name: string): HTMLElement => {
	const found = document.querySelector<HTMLElement>(`[data-slot="${name}"]`);
	if (found === null) {
		throw new Error(`no element with data-slot="${name}"`);
	}
	return found;
};

function BarChart(props: { readonly stacked?: boolean } = {}) {
	return (
		<Chart.Root
			config={config}
			data={data}
			x={{ key: "month" }}
			y={{ keys: ["projects", "bookings"], stacked: props.stacked }}
		>
			<Chart.Grid />
			<Chart.XAxis />
			<Chart.YAxis />
			<Chart.Cursor />
			<Chart.Bars />
			<Chart.Tooltip />
			<Chart.Legend />
		</Chart.Root>
	);
}

describe("Chart.Root", () => {
	it("renders an SVG labelled with the series it draws", () => {
		render(<BarChart />);
		const image = screen.getByRole("img");
		expect(image.getAttribute("data-slot")).toBe("chart-svg");
		expect(image.getAttribute("aria-label")).toBe(
			"Chart of Projects published, Bookings confirmed over 3 points",
		);
	});

	it("exposes the numbers as a hidden data table", () => {
		render(<BarChart />);
		const table = slot("chart-data-table");
		expect(table.className).toContain("sr-only");
		const headers = Array.from(table.querySelectorAll("thead th")).map(
			(cell) => cell.textContent,
		);
		expect(headers).toEqual([
			"month",
			"Projects published",
			"Bookings confirmed",
		]);
		const firstRow = Array.from(
			table.querySelectorAll(
				"tbody tr:first-child th, tbody tr:first-child td",
			),
		).map((cell) => cell.textContent);
		expect(firstRow).toEqual(["January", "24", "18"]);
	});

	it("injects a guarded colour variable per configured series", () => {
		render(<BarChart />);
		const style = slot("chart-style").innerHTML;
		expect(style).toContain("--color-projects: var(--chart-1);");
		expect(style).toContain(".dark [data-chart=");
	});

	it("gates the entrance animation behind prefers-reduced-motion", () => {
		render(<BarChart />);
		expect(slot("chart-style").innerHTML).toContain(
			"@media (prefers-reduced-motion: no-preference)",
		);
	});

	it("throws when a part is used outside a root", () => {
		expect(() => render(<Chart.Bars />)).toThrow(
			/must be used within a <Chart.Root \/>/,
		);
	});
});

describe("Chart.Bars", () => {
	it("draws one bar per datum per series", () => {
		render(<BarChart />);
		expect(slots("chart-bar")).toHaveLength(6);
	});

	it("rounds only the outer segment of a stack", () => {
		render(<BarChart stacked />);
		const bars = slots("chart-bar");
		const bottom = bars.find(
			(bar) =>
				bar.getAttribute("data-series") === "projects" &&
				bar.getAttribute("data-index") === "0",
		);
		const top = bars.find(
			(bar) =>
				bar.getAttribute("data-series") === "bookings" &&
				bar.getAttribute("data-index") === "0",
		);
		expect(bottom?.getAttribute("d")).not.toContain("A");
		expect(top?.getAttribute("d")).toContain("A");
	});
});

describe("Chart axes and grid", () => {
	it("labels the category axis with the categories", () => {
		render(<BarChart />);
		const labels = Array.from(
			slot("chart-x-axis").querySelectorAll('[data-slot="chart-tick-label"]'),
		).map((label) => label.textContent);
		expect(labels).toEqual(["January", "February", "March"]);
	});

	it("labels the value axis with round numbers", () => {
		render(<BarChart />);
		const labels = Array.from(
			slot("chart-y-axis").querySelectorAll('[data-slot="chart-tick-label"]'),
		).map((label) => label.textContent);
		expect(labels).toEqual(["0", "5", "10", "15", "20", "25", "30", "35"]);
	});

	it("draws horizontal grid lines by default", () => {
		render(<BarChart />);
		const lines = slots("chart-grid-line");
		expect(lines.length).toBeGreaterThan(0);
		expect(
			lines.every(
				(line) => line.getAttribute("data-direction") === "horizontal",
			),
		).toBe(true);
	});
});

describe("keyboard navigation", () => {
	it("selects the first datum on the first arrow, and shows the tooltip", () => {
		render(<BarChart />);
		const svg = screen.getByRole("img");
		expect(document.querySelector('[data-slot="chart-tooltip"]')).toBeNull();

		fireEvent.keyDown(svg, { key: "ArrowRight" });
		const tooltip = slot("chart-tooltip-content");
		expect(tooltip.getAttribute("aria-live")).toBe("polite");
		expect(tooltip.textContent).toContain("January");
		expect(tooltip.textContent).toContain("Projects published");
		expect(tooltip.textContent).toContain("24");
	});

	it("walks the categories and clamps at both ends", () => {
		render(<BarChart />);
		const svg = screen.getByRole("img");
		fireEvent.keyDown(svg, { key: "End" });
		expect(slot("chart-tooltip-content").textContent).toContain("March");
		fireEvent.keyDown(svg, { key: "ArrowRight" });
		expect(slot("chart-tooltip-content").textContent).toContain("March");
		fireEvent.keyDown(svg, { key: "Home" });
		expect(slot("chart-tooltip-content").textContent).toContain("January");
	});

	it("dismisses the readout on Escape", () => {
		render(<BarChart />);
		const svg = screen.getByRole("img");
		fireEvent.keyDown(svg, { key: "ArrowRight" });
		fireEvent.keyDown(svg, { key: "Escape" });
		expect(document.querySelector('[data-slot="chart-tooltip"]')).toBeNull();
	});

	it("dims the bars that are not the active one", () => {
		render(<BarChart />);
		fireEvent.keyDown(screen.getByRole("img"), { key: "ArrowRight" });
		const states = slots("chart-bar").map((bar) =>
			bar.getAttribute("data-state"),
		);
		expect(states.filter((state) => state === "active")).toHaveLength(2);
		expect(states.filter((state) => state === "muted")).toHaveLength(4);
	});

	it("moves the cursor band onto the active category", () => {
		render(<BarChart />);
		fireEvent.keyDown(screen.getByRole("img"), { key: "ArrowRight" });
		expect(slot("chart-cursor").getAttribute("data-variant")).toBe("band");
	});
});

describe("tooltip placement", () => {
	it("escapes a clipping ancestor instead of being cut in half", () => {
		// A sparkline in a card: 64 pixels tall, inside `overflow-hidden`. A panel
		// rendered inside the chart would be clipped to nothing.
		render(
			<div className="overflow-hidden" style={{ height: 64 }}>
				<BarChart />
			</div>,
		);
		fireEvent.keyDown(screen.getByRole("img"), { key: "ArrowRight" });

		const tooltip = slot("chart-tooltip");
		expect(tooltip.parentElement).toBe(document.body);
		expect(slot("chart-root").contains(tooltip)).toBe(false);
		expect(tooltip.className).toContain("fixed");
	});

	it("carries the chart id so the series colours still resolve", () => {
		render(<BarChart />);
		fireEvent.keyDown(screen.getByRole("img"), { key: "ArrowRight" });
		expect(slot("chart-tooltip").getAttribute("data-chart")).toBe(
			slot("chart-root").getAttribute("data-chart"),
		);
	});

	it("flips below the pointer when there is no room above it", () => {
		render(<BarChart />);
		const svg = screen.getByRole("img");
		// jsdom reports a zero-sized box, so every anchor lands at the viewport
		// origin — which is exactly the no-room-above case.
		fireEvent.keyDown(svg, { key: "ArrowRight" });
		expect(slot("chart-tooltip").getAttribute("data-placement")).toBe("below");
	});
});

describe("pointer scrubbing", () => {
	it("selects the datum under the pointer, including on first touch", () => {
		render(<BarChart />);
		const svg = screen.getByRole("img");
		// jsdom reports a zero-sized box, so the pointer maps straight onto the
		// SVG's own user units: 40px of left margin plus most of the first slot.
		fireEvent.pointerDown(svg, { clientX: 60, clientY: 100 });
		expect(slot("chart-tooltip-content").textContent).toContain("January");

		fireEvent.pointerMove(svg, { clientX: 300, clientY: 100 });
		expect(slot("chart-tooltip-content").textContent).toContain("March");

		fireEvent.pointerLeave(svg);
		expect(document.querySelector('[data-slot="chart-tooltip"]')).toBeNull();
	});
});

describe("Chart.Legend", () => {
	it("lists the series by their configured labels", () => {
		render(<BarChart />);
		const labels = slots("chart-legend-item").map((item) => item.textContent);
		expect(labels).toEqual(["Projects published", "Bookings confirmed"]);
	});
});

describe("Chart.LabelList", () => {
	function GroupedBars(props: { readonly marks?: "points" | "bars" }) {
		return (
			<Chart.Root
				config={config}
				data={data}
				x={{ key: "month" }}
				y={{ keys: ["projects", "bookings"] }}
			>
				<Chart.Bars />
				<Chart.LabelList seriesKey="projects" marks={props.marks} />
			</Chart.Root>
		);
	}

	const labelXs = (): number[] =>
		slots("chart-label").map((label) => Number(label.getAttribute("x")));

	const barXs = (series: string): number[] =>
		Array.from(
			document.querySelectorAll<SVGPathElement>(
				`[data-slot="chart-bar"][data-series="${series}"]`,
			),
		).map((bar) => {
			// The rounded path starts at the bar's left edge.
			const [, x] = /^M\s*([\d.]+)/.exec(bar.getAttribute("d") ?? "") ?? [];
			return Number(x);
		});

	it("centres each label on its own bar, not on the group", () => {
		render(<GroupedBars marks="bars" />);
		const lefts = barXs("projects");
		const labels = labelXs();
		expect(labels).toHaveLength(lefts.length);
		// Every label sits inside the horizontal span of the bar it describes.
		// The lane is narrower than the slot, so a label anchored to the slot
		// centre would fall past the right edge of the first (left-hand) lane.
		for (const [index, left] of lefts.entries()) {
			const label = labels[index] ?? Number.NaN;
			expect(label).toBeGreaterThan(left);
		}
	});

	it("drifts off its bar when anchored to the series point instead", () => {
		render(<GroupedBars marks="points" />);
		const pointAnchored = labelXs();
		cleanup();
		render(<GroupedBars marks="bars" />);
		const barAnchored = labelXs();
		// The regression this guards: with two series the two anchorings differ,
		// and only the bar one lands on the bar. With a single series they agree,
		// which is why the bug stayed invisible until a second key was added.
		expect(barAnchored).not.toEqual(pointAnchored);
	});
});
