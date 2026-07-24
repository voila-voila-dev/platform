// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Chart, type ChartConfig } from "#/components/chart.tsx";

afterEach(cleanup);

const config: ChartConfig = {
	design: { label: "Design", color: "var(--chart-1)" },
	development: { label: "Development", color: "var(--chart-2)" },
	writing: { label: "Writing", color: "var(--chart-3)" },
	freelancers: { label: "Freelancers" },
};

const data = [
	{ specialty: "design", freelancers: 50 },
	{ specialty: "development", freelancers: 30 },
	{ specialty: "writing", freelancers: 20 },
];

const slots = (name: string): HTMLElement[] =>
	Array.from(document.querySelectorAll<HTMLElement>(`[data-slot="${name}"]`));

const slot = (name: string): HTMLElement => {
	const found = document.querySelector<HTMLElement>(`[data-slot="${name}"]`);
	if (found === null) {
		throw new Error(`no element with data-slot="${name}"`);
	}
	return found;
};

function Donut() {
	return (
		<Chart.Root
			config={config}
			data={data}
			x={{ key: "specialty" }}
			y={{ keys: ["freelancers"] }}
			margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
			interactive={false}
		>
			<Chart.Donut />
			<Chart.Tooltip content={<Chart.TooltipContent nameKey="specialty" />} />
			<Chart.Legend content={<Chart.LegendContent nameKey="specialty" />} />
		</Chart.Root>
	);
}

describe("Chart.Donut", () => {
	it("draws one wedge per row, coloured by the row's config entry", () => {
		render(<Donut />);
		const wedges = slots("chart-slice");
		expect(wedges).toHaveLength(3);
		expect(wedges.map((wedge) => wedge.getAttribute("data-series"))).toEqual([
			"design",
			"development",
			"writing",
		]);
		expect(wedges[0].getAttribute("fill")).toBe("var(--color-design)");
	});

	it("leaves a hole in the middle", () => {
		render(<Donut />);
		expect(slot("chart-pie").getAttribute("data-variant")).toBe("donut");
	});

	it("selects a wedge on hover and reads it out", () => {
		render(<Donut />);
		fireEvent.pointerOver(slots("chart-slice")[1]);
		const tooltip = slot("chart-tooltip-content");
		expect(tooltip.textContent).toContain("Development");
		expect(tooltip.textContent).toContain("30");
		expect(slots("chart-slice")[0].getAttribute("data-state")).toBe("muted");
	});

	it("names the legend entries after the rows", () => {
		render(<Donut />);
		expect(slots("chart-legend-item").map((item) => item.textContent)).toEqual([
			"Design",
			"Development",
			"Writing",
		]);
	});
});

describe("Chart.Radar", () => {
	it("draws a closed shape with one vertex per category", () => {
		render(
			<Chart.Root
				config={{ coverage: { label: "Coverage", color: "var(--chart-1)" } }}
				data={[
					{ region: "A", coverage: 90 },
					{ region: "B", coverage: 60 },
					{ region: "C", coverage: 30 },
				]}
				x={{ key: "region" }}
				y={{ keys: ["coverage"] }}
				margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
			>
				<Chart.PolarGrid />
				<Chart.PolarAngleAxis />
				<Chart.Radar />
			</Chart.Root>,
		);
		const shape = slot("chart-radar-shape").getAttribute("d") ?? "";
		expect(shape.startsWith("M")).toBe(true);
		expect(shape.endsWith("Z")).toBe(true);
		expect(shape.match(/L/g)).toHaveLength(2);
		expect(slots("chart-polar-spoke")).toHaveLength(3);
		expect(slots("chart-polar-tick").map((tick) => tick.textContent)).toEqual([
			"A",
			"B",
			"C",
		]);
	});
});

describe("Chart.RadialBar", () => {
	it("fills each track in proportion to its value", () => {
		render(
			<Chart.Root
				config={{ fillRate: { label: "Fill rate", color: "var(--chart-2)" } }}
				data={[{ metric: "fillRate", value: 75 }]}
				x={{ key: "metric" }}
				y={{ keys: ["value"], domain: [0, 100] }}
				margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
			>
				<Chart.RadialBar />
			</Chart.Root>,
		);
		expect(slots("chart-radial-background")).toHaveLength(1);
		// Three quarters of a turn is past the half-turn mark, so the arc has to
		// be flagged as the long way round.
		expect(slot("chart-radial-value").getAttribute("d")).toContain(" 1 1 ");
	});
});

describe("horizontal orientation", () => {
	it("puts the categories on the left axis and the values along the bottom", () => {
		render(
			<Chart.Root
				config={config}
				data={data}
				x={{ key: "specialty" }}
				y={{ keys: ["freelancers"] }}
				orientation="horizontal"
			>
				<Chart.YAxis />
				<Chart.Bars />
			</Chart.Root>,
		);
		expect(
			Array.from(
				slot("chart-y-axis").querySelectorAll('[data-slot="chart-tick-label"]'),
			).map((label) => label.textContent),
		).toEqual(["design", "development", "writing"]);
		// Every bar starts at the value baseline on the left, not at the top.
		expect(
			slots("chart-bar").every((bar) =>
				(bar.getAttribute("d") ?? "").startsWith("M0,"),
			),
		).toBe(true);
	});
});
