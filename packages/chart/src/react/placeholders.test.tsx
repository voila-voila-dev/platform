// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { compileChart } from "#/core/compile.ts";
import { defineChart } from "#/core/define-chart.ts";
import { barY } from "#/core/marks/bar.ts";
import { Chart } from "#/react/chart.tsx";
import { ChartEmpty, ChartSkeleton } from "#/react/chart-placeholders.tsx";

afterEach(cleanup);

const rows = [
	{ week: "S1", n: 4, done: true },
	{ week: "S2", n: 6, done: false },
];
const projected = defineChart({
	marks: [
		barY(rows, {
			x: "week",
			y: "n",
			fill: "red",
			projected: (row) => !row.done,
		}),
	],
});

describe("projected bars", () => {
	it("hatches only the projected bars", () => {
		const scene = compileChart(projected, { width: 300, height: 200 });
		const marks = scene.nodes.find((node) => node.key === "marks");
		const bars = marks?.kind === "group" ? marks.children : [];
		expect(
			bars.map((bar) =>
				bar.kind === "rect" ? bar.paint.hatch === true : null,
			),
		).toEqual([false, true]);
	});

	it("fills them with one shared pattern of their colour", () => {
		const { container } = render(
			<Chart definition={projected} ariaLabel="Missions" />,
		);
		const patterns = container.querySelectorAll("pattern");
		expect(patterns).toHaveLength(1);
		const hatched = container.querySelector(`[fill="url(#${patterns[0].id})"]`);
		expect(hatched?.getAttribute("stroke-dasharray")).toBe("3 2");
	});
});

describe("placeholders", () => {
	it("announces the skeleton as a status and shows the empty message", () => {
		render(
			<>
				<ChartSkeleton
					label="Chargement des missions"
					style={{ height: 200 }}
				/>
				<ChartEmpty style={{ height: 200 }}>Aucune mission</ChartEmpty>
			</>,
		);
		expect(
			screen.getByRole("status", { name: "Chargement des missions" }),
		).toBeTruthy();
		expect(screen.getByText("Aucune mission")).toBeTruthy();
	});
});
