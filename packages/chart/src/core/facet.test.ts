import { describe, expect, it } from "vitest";

import { compileChart } from "#/core/compile.ts";
import { defineChart } from "#/core/define-chart.ts";
import { facet } from "#/core/facet.ts";
import { barY } from "#/core/marks/bar.ts";
import { lineY } from "#/core/marks/line.ts";
import { findNearest, focusStops } from "#/core/nearest.ts";

const rows = ["Nantes", "Lyon", "Lille"].flatMap((city, cityIndex) =>
	["Jan", "Feb", "Mar"].map((month, monthIndex) => ({
		city,
		month,
		missions: (cityIndex + 1) * 10 + monthIndex * 5,
	})),
);

const faceted = defineChart({
	facet: facet({
		values: ["Nantes", "Lyon", "Lille"],
		columns: 3,
		marks: (city) => [
			barY(
				rows.filter((row) => row.city === city),
				{ x: "month", y: "missions", label: "Missions" },
			),
		],
	}),
});

describe("facets", () => {
	const scene = compileChart(faceted, { width: 900, height: 300 });

	it("lays the cells out on a grid, each on the shared y domain", () => {
		expect(scene.cells?.map((cell) => cell.label)).toEqual([
			"Nantes",
			"Lyon",
			"Lille",
		]);
		const [first, second] = scene.cells ?? [];
		expect(second.plot.x).toBeGreaterThan(first.plot.x + first.plot.width);
		// Lille peaks at 40: every cell's y runs to 40, so the bars compare.
		expect(scene.scales.y?.domain[1]).toBe(40);
	});

	it("keeps each column inside its cell and names the cell", () => {
		const stops = focusStops(scene);
		expect(stops).toHaveLength(9);
		expect(stops[0].points[0].title).toBe("Nantes · Jan");
		expect(stops[3].points[0].title).toBe("Lyon · Jan");
	});

	it("hits the cell under the pointer only", () => {
		const stops = focusStops(scene);
		const lyon = scene.cells?.[1].plot;
		if (lyon === undefined) throw new Error("no cell");
		const hit = findNearest(scene, stops, lyon.x + 2, lyon.y + lyon.height / 2);
		expect(stops[hit?.stop ?? -1].points[0].facet).toBe("Lyon");
	});

	it("zooms a continuous x and clips the marks to the plot", () => {
		const series = Array.from({ length: 10 }, (_unused, index) => ({
			t: index,
			v: index * index,
		}));
		const zoomed = compileChart(
			defineChart({ marks: [lineY(series, { x: "t", y: "v" })] }),
			{
				width: 400,
				height: 200,
				xDomain: [2, 5],
			},
		);
		expect(zoomed.scales.x?.domain).toEqual([2, 5]);
		const marks = zoomed.nodes.find((node) => node.key === "marks");
		expect(marks?.kind === "group" && marks.clip).toEqual(zoomed.plot);
	});
});
