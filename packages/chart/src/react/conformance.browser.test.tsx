/*
 * Conformance: every mark family, drawn the way a reader meets it. Each chart
 * passes axe and is reached from the keyboard on both renderers; at a phone,
 * a column and a desktop width, in light and dark, its text stays inside the
 * chart, its axis labels do not collide and read at 4.5:1 or better. Then the
 * two media features a chart must honour: forced colours and reduced motion.
 */
import axe from "axe-core";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { commands, userEvent } from "vitest/browser";
import { brushX } from "#/brush/index.ts";
import { CanvasRenderer } from "#/canvas/canvas-renderer.tsx";
import { density2d } from "#/contour/index.ts";
import {
	type ChartDefinition,
	type ChartSpec,
	defineChart,
} from "#/core/define-chart.ts";
import { facet } from "#/core/facet.ts";
import { areaY } from "#/core/marks/area.ts";
import { barX, barY } from "#/core/marks/bar.ts";
import { cell } from "#/core/marks/cell.ts";
import { dot } from "#/core/marks/dot.ts";
import { funnel } from "#/core/marks/funnel.ts";
import { lineY } from "#/core/marks/line.ts";
import { arc, donut, radar, radialBar } from "#/core/marks/polar.ts";
import { rectY } from "#/core/marks/rect.ts";
import { ruleX, ruleY } from "#/core/marks/rule.ts";
import { differenceY } from "#/core/marks/stats/difference.ts";
import { boxY, ridgeline, violinY } from "#/core/marks/stats/distribution.ts";
import { dodgeY } from "#/core/marks/stats/dodge.ts";
import { hexbin } from "#/core/marks/stats/hexbin.ts";
import { histogram } from "#/core/marks/stats/histogram.ts";
import { regressionY } from "#/core/marks/stats/regression.ts";
import { waffleY } from "#/core/marks/stats/waffle.ts";
import { text } from "#/core/marks/text.ts";
import { tickX, tickY } from "#/core/marks/tick.ts";
import { forceGraph } from "#/force/index.ts";
import { geoDot, geoShape, projection } from "#/geo/index.ts";
import { sunburst, tree, treemap } from "#/hierarchy/index.ts";
import { Chart } from "#/react/chart.tsx";
import type { ChartRenderer } from "#/react/renderer.ts";
import { SvgRenderer } from "#/react/svg-renderer.tsx";
import { sankey } from "#/sankey/index.ts";
import { voronoi } from "#/voronoi/index.ts";

/** A seeded stream, so every run draws the same data. */
function random(seed: number) {
	let state = seed;
	return () => {
		state = (state * 1664525 + 1013904223) % 4294967296;
		return state / 4294967296;
	};
}

const next = random(7);
const months = Array.from({ length: 12 }, (_unused, index) => ({
	month: new Date(Date.UTC(2026, index, 1)),
	clubs: 10 + index * 2 + Math.round(next() * 6),
	pros: 6 + index + Math.round(next() * 4),
	low: 4 + index,
	high: 14 + index * 2,
}));
const bySeries = months.flatMap((row) => [
	{ month: row.month, series: "Clubs", value: row.clubs },
	{ month: row.month, series: "Pros", value: row.pros },
]);
const professions = [
	{ profession: "Kiné", missions: 48 },
	{ profession: "Médecin", missions: 21 },
	{ profession: "Ostéopathe", missions: 14 },
	{ profession: "Préparateur", missions: 9 },
];
const durations = ["Kiné", "Médecin", "Ostéopathe"].flatMap((profession, row) =>
	Array.from({ length: 40 }, () => ({
		profession,
		hours: 2 + row * 1.5 + (next() + next() + next() - 1.5) * 2,
	})),
);
const pairs = Array.from({ length: 90 }, () => {
	const rate = 40 + next() * 60;
	return { rate, rating: 2 + rate / 30 + (next() - 0.5) * 1.5 };
});

interface Branch {
	readonly name: string;
	readonly missions?: number;
	readonly children?: ReadonlyArray<Branch>;
}
const activity: Branch = {
	name: "Missions",
	children: [
		{
			name: "Kiné",
			children: [
				{ name: "Football", missions: 42 },
				{ name: "Rugby", missions: 28 },
			],
		},
		{ name: "Médecin", children: [{ name: "Football", missions: 18 }] },
		{ name: "Ostéopathe", children: [{ name: "Rugby", missions: 11 }] },
	],
};
const hierarchyOptions = {
	name: (node: Branch) => node.name,
	value: (node: Branch) => node.missions ?? 0,
	label: "Missions",
};

/** Two made-up squares over western France, wound clockwise as GeoJSON wants. */
function square(name: string, west: number, south: number) {
	return {
		type: "Feature" as const,
		properties: { name },
		geometry: {
			type: "Polygon" as const,
			coordinates: [
				[
					[west, south],
					[west, south + 2],
					[west + 2, south + 2],
					[west + 2, south],
					[west, south],
				],
			],
		},
	};
}
const regions = [square("Ouest", -3, 46), square("Centre", -1, 46)];

const gallery: ReadonlyArray<readonly [string, ChartSpec]> = [
	[
		"line",
		{ marks: [lineY(bySeries, { x: "month", y: "value", color: "series" })] },
	],
	[
		"band and area",
		{
			marks: [
				areaY(months, { x: "month", from: "low", to: "high", label: "Range" }),
				areaY(months, { x: "month", y: "clubs", label: "Clubs", line: true }),
			],
		},
	],
	[
		"stacked bars",
		{ marks: [barY(bySeries, { x: "month", y: "value", color: "series" })] },
	],
	[
		"grouped bars, ticks and rules",
		{
			marks: [
				barY(bySeries.slice(0, 8), {
					x: "month",
					y: "value",
					color: "series",
					group: true,
				}),
				tickY(months.slice(0, 4), { x: "month", y: "high", label: "Target" }),
				ruleY([0]),
				ruleX([months[2]?.month], { label: "Today", position: "before" }),
			],
		},
	],
	[
		"horizontal bars",
		{ marks: [barX(professions, { x: "missions", y: "profession" })] },
	],
	["strip", { marks: [tickX(durations, { x: "hours", y: "profession" })] }],
	[
		"scatter, text and regression",
		{
			marks: [
				dot(pairs, { x: "rate", y: "rating", r: 2.5 }),
				regressionY(pairs, { x: "rate", y: "rating", label: "Trend" }),
				text([pairs[0]], {
					x: "rate",
					y: "rating",
					text: () => "First",
					dy: -8,
				}),
			],
		},
	],
	[
		"heatmap",
		{
			marks: [
				cell(
					["Mon", "Tue", "Wed"].flatMap((day, row) =>
						["9h", "12h", "15h"].map((hour, column) => ({
							day,
							hour,
							count: row * 3 + column,
						})),
					),
					{ x: "day", y: "hour", color: "count" },
				),
			],
		},
	],
	[
		"rect",
		{
			marks: [
				rectY(
					[
						{ from: 0, to: 10, n: 4 },
						{ from: 10, to: 20, n: 9 },
						{ from: 20, to: 30, n: 6 },
					],
					{ x1: "from", x2: "to", y: "n", label: "Count" },
				),
			],
		},
	],
	[
		"pie",
		{
			marks: [arc(professions, { category: "profession", value: "missions" })],
		},
	],
	[
		"donut",
		{
			marks: [
				donut(professions, { category: "profession", value: "missions" }),
			],
		},
	],
	[
		"radial bars",
		{
			marks: [
				radialBar(professions, {
					category: "profession",
					value: "missions",
					max: 50,
				}),
			],
		},
	],
	[
		"radar",
		{
			marks: [
				radar(
					["Speed", "Quality", "Cost", "Scope"].flatMap((axis, index) => [
						{ axis, team: "A", score: 3 + index },
						{ axis, team: "B", score: 8 - index },
					]),
					{ axis: "axis", value: "score", color: "team", max: 10 },
				),
			],
		},
	],
	[
		"funnel",
		{
			marks: [
				funnel(professions, { category: "profession", value: "missions" }),
			],
		},
	],
	[
		"histogram",
		{ marks: [histogram(durations, { x: "hours", label: "Missions" })] },
	],
	[
		"box",
		{ marks: [boxY(durations, { category: "profession", value: "hours" })] },
	],
	[
		"violin",
		{ marks: [violinY(durations, { category: "profession", value: "hours" })] },
	],
	[
		"ridgeline",
		{
			marks: [ridgeline(durations, { category: "profession", value: "hours" })],
		},
	],
	[
		"beeswarm",
		{
			marks: [
				dodgeY(durations.slice(0, 60), { x: "hours", color: "profession" }),
			],
		},
	],
	[
		"waffle",
		{
			marks: [
				waffleY(professions, { x: "profession", y: "missions", columns: 8 }),
			],
		},
	],
	[
		"difference",
		{
			marks: [
				differenceY(months, {
					x: "month",
					y1: "clubs",
					y2: "pros",
					labels: ["Clubs", "Pros"],
				}),
			],
		},
	],
	[
		"hexbin",
		{ marks: [hexbin(pairs, { x: "rate", y: "rating", radius: 12 })] },
	],
	[
		"density",
		{
			marks: [
				density2d(pairs, { x: "rate", y: "rating" }),
				dot(pairs, { x: "rate", y: "rating", r: 1.5 }),
			],
		},
	],
	[
		"voronoi",
		{
			marks: [
				voronoi(pairs.slice(0, 40), { x: "rate", y: "rating" }),
				dot(pairs.slice(0, 40), { x: "rate", y: "rating", r: 2 }),
			],
		},
	],
	["treemap", { marks: [treemap(activity, hierarchyOptions)] }],
	["sunburst", { marks: [sunburst(activity, hierarchyOptions)] }],
	["tree", { marks: [tree(activity, hierarchyOptions)] }],
	[
		"sankey",
		{
			marks: [
				sankey({
					nodes: [
						{ id: "Visits" },
						{ id: "Sign-ups" },
						{ id: "Missions" },
						{ id: "Lost" },
					],
					links: [
						{ source: "Visits", target: "Sign-ups", value: 80 },
						{ source: "Sign-ups", target: "Missions", value: 30 },
						{ source: "Sign-ups", target: "Lost", value: 50 },
					],
				}),
			],
		},
	],
	[
		"force",
		{
			marks: [
				forceGraph({
					nodes: [
						{ id: "FC Nantes", group: "Clubs" },
						{ id: "HBC Nantes", group: "Clubs" },
						{ id: "Léa", group: "Pros" },
						{ id: "Hugo", group: "Pros" },
					],
					links: [
						{ source: "Léa", target: "FC Nantes" },
						{ source: "Hugo", target: "FC Nantes" },
						{ source: "Hugo", target: "HBC Nantes" },
					],
				}),
			],
		},
	],
	[
		"map",
		{
			projection: projection("mercator", {
				domain: { type: "FeatureCollection", features: regions } as never,
			}),
			marks: [
				geoShape(regions, {
					name: (region) => region.properties.name,
					label: "Region",
				}),
				geoDot([{ city: "Nantes", lon: -1.55, lat: 47.22 }], {
					longitude: "lon",
					latitude: "lat",
					name: "city",
				}),
			],
		},
	],
	[
		"small multiples",
		{
			facet: facet({
				values: ["Clubs", "Pros"],
				marks: (series) => [
					barY(
						bySeries.filter((row) => row.series === series),
						{ x: "month", y: "value", label: String(series) },
					),
				],
			}),
		},
	],
];

const LIGHT = {
	background: "#ffffff",
	"--foreground": "#0a0a0a",
	"--muted-foreground": "#6b6b6b",
	"--border": "#e5e5e5",
};
const DARK = {
	background: "#0a0a0a",
	"--foreground": "#fafafa",
	"--muted-foreground": "#a3a3a3",
	"--border": "#262626",
};

let root: Root | null = null;
let host: HTMLDivElement | null = null;

async function mount(
	element: React.ReactNode,
	{
		width = 480,
		theme = LIGHT,
	}: { width?: number; theme?: Record<string, string> } = {},
) {
	host = document.createElement("div");
	host.style.width = `${width}px`;
	for (const [property, value] of Object.entries(theme)) {
		host.style.setProperty(property, value);
	}
	host.style.color = theme["--foreground"] ?? "";
	document.body.append(host);
	root = createRoot(host);
	await act(async () => root?.render(element));
	// Text metrics land a frame after the first paint.
	await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
	return host;
}

afterEach(async () => {
	await act(async () => root?.unmount());
	host?.remove();
	root = null;
	host = null;
	await commands.emulateMedia({
		forcedColors: "none",
		reducedMotion: "no-preference",
	});
});

function chartFor(
	spec: ChartSpec,
	name: string,
	renderer: ChartRenderer = SvgRenderer,
) {
	return (
		<Chart
			definition={defineChart(spec)}
			ariaLabel={name}
			renderer={renderer}
			animate={false}
		/>
	);
}

/** Any CSS colour as sRGB channels, by painting it: the browser does the parsing. */
function rgbOf(color: string): readonly [number, number, number] {
	const canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	const context = canvas.getContext("2d");
	if (!context) throw new Error("no 2d context");
	context.fillStyle = color;
	context.fillRect(0, 0, 1, 1);
	const [red = 0, green = 0, blue = 0] = context.getImageData(0, 0, 1, 1).data;
	return [red, green, blue];
}

function luminance([red, green, blue]: readonly [
	number,
	number,
	number,
]): number {
	const [r, g, b] = [red, green, blue].map((channel) => {
		const value = channel / 255;
		return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

function contrast(foreground: string, background: string): number {
	const [light, dark] = [
		luminance(rgbOf(foreground)),
		luminance(rgbOf(background)),
	].sort((a, b) => b - a);
	return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
}

function overlaps(a: DOMRect, b: DOMRect): boolean {
	return (
		a.left < b.right - 1 &&
		b.left < a.right - 1 &&
		a.top < b.bottom - 1 &&
		b.top < a.bottom - 1
	);
}

describe.each<[string, ChartRenderer]>([
	["svg", SvgRenderer],
	["canvas", CanvasRenderer],
])("every mark family on %s", (_renderer, renderer) => {
	it.each(gallery)(
		"%s passes axe and is reached from the keyboard",
		async (name, spec) => {
			const container = await mount(chartFor(spec, name, renderer));
			const results = await axe.run(container);
			expect(results.violations.map((violation) => violation.id)).toEqual([]);

			await userEvent.tab();
			const surface = container.querySelector("[data-slot=chart-surface]");
			expect(document.activeElement).toBe(surface);
			await expect
				.poll(() => container.querySelector("[aria-live]")?.textContent ?? "")
				.not.toBe("");
			expect(
				container.querySelectorAll("[data-slot=chart-data-table] tbody tr")
					.length,
			).toBeGreaterThan(0);
		},
	);
});

describe.each([320, 640, 960])("at %ipx", (width) => {
	describe.each<[string, Record<string, string>]>([
		["light", LIGHT],
		["dark", DARK],
	])("in %s", (_theme, theme) => {
		it.each(gallery)(
			"%s keeps its text inside, apart and legible",
			async (name, spec) => {
				const container = await mount(chartFor(spec, name), { width, theme });
				const svg = container.querySelector("[data-slot=chart-svg]");
				if (!(svg instanceof SVGSVGElement)) throw new Error("no svg");
				const frame = svg.getBoundingClientRect();
				const texts = [...svg.querySelectorAll("text")].filter(
					(node) => (node.textContent ?? "") !== "",
				);
				for (const node of texts) {
					const box = node.getBoundingClientRect();
					expect
						.soft(
							box.left >= frame.left - 1 &&
								box.right <= frame.right + 1 &&
								box.top >= frame.top - 1 &&
								box.bottom <= frame.bottom + 1,
							`"${node.textContent}" leaves the chart`,
						)
						.toBe(true);
				}
				const axisLabels = texts.filter((node) => node.dataset.role === "axis");
				for (const [index, node] of axisLabels.entries()) {
					for (const other of axisLabels.slice(index + 1)) {
						expect
							.soft(
								overlaps(
									node.getBoundingClientRect(),
									other.getBoundingClientRect(),
								),
								`"${node.textContent}" collides with "${other.textContent}"`,
							)
							.toBe(false);
					}
					expect
						.soft(
							contrast(getComputedStyle(node).fill, theme.background ?? "#fff"),
							`"${node.textContent}" contrast`,
						)
						.toBeGreaterThanOrEqual(4.5);
				}
			},
		);
	});
});

const lines = defineChart({
	marks: [lineY(bySeries, { x: "month", y: "value", color: "series" })],
});

describe("forced colours", () => {
	it("draws axes in system colours and keeps the focus ring visible", async () => {
		await commands.emulateMedia({ forcedColors: "active" });
		const container = await mount(
			<Chart definition={lines} ariaLabel="Clubs et pros" />,
		);
		const axis = container.querySelector(
			"[data-slot=chart-svg] [data-role=axis]",
		);
		if (!(axis instanceof SVGElement)) throw new Error("no axis");
		expect(rgbOf(getComputedStyle(axis).fill)).toEqual(rgbOf("CanvasText"));

		await userEvent.tab();
		const ring = container.querySelector("[data-slot=chart-focus-ring]");
		if (!(ring instanceof SVGElement)) throw new Error("no focus ring");
		expect(rgbOf(getComputedStyle(ring).stroke)).toEqual(rgbOf("Highlight"));
	});

	it("keeps the series apart: the legend and the table name each one", async () => {
		await commands.emulateMedia({ forcedColors: "active" });
		const container = await mount(
			<Chart definition={lines} ariaLabel="Clubs et pros" />,
		);
		const legend =
			container.querySelector("[data-slot=chart-legend]")?.textContent ?? "";
		expect(legend).toContain("Clubs");
		expect(legend).toContain("Pros");
		const series = new Set(
			[
				...container.querySelectorAll("[data-slot=chart-svg] [data-role=mark]"),
			].map((node) => getComputedStyle(node).stroke),
		);
		expect(series.size).toBe(2);
	});
});

describe("reduced motion", () => {
	function bars(scale: number): ChartDefinition {
		// A fixed axis: doubling every bar on a nice axis would double the axis too.
		return defineChart({
			y: { domain: [0, 80] },
			marks: [
				barY(months, {
					x: "month",
					y: (row) => row.clubs * scale,
					label: "Clubs",
				}),
			],
		});
	}

	function heights(container: HTMLElement): string[] {
		return [
			...container.querySelectorAll("[data-slot=chart-svg] [data-role=mark]"),
		].map((node) => node.getAttribute("d") ?? "");
	}

	async function update(scale: number) {
		await act(async () =>
			root?.render(
				<Chart definition={bars(scale)} ariaLabel="Clubs" animate={400} />,
			),
		);
	}

	it("tweens an update when motion is welcome", async () => {
		const container = await mount(
			<Chart definition={bars(1)} ariaLabel="Clubs" animate={400} />,
		);
		const before = heights(container);
		await update(2);
		const during = heights(container);
		await act(() => new Promise((resolve) => setTimeout(resolve, 600)));
		const after = heights(container);
		expect(during).not.toEqual(after);
		expect(after).not.toEqual(before);
	});

	it("snaps to the new data when the reader asks for less motion", async () => {
		await commands.emulateMedia({ reducedMotion: "reduce" });
		const container = await mount(
			<Chart definition={bars(1)} ariaLabel="Clubs" animate={400} />,
		);
		const before = heights(container);
		await update(2);
		const during = heights(container);
		await act(() => new Promise((resolve) => setTimeout(resolve, 600)));
		expect(during).not.toEqual(before);
		expect(during).toEqual(heights(container));
	});
});

// The brush is a layer, not a mark: it is checked with the chart it sits on.
describe("brush", () => {
	it("passes axe with its two sliders", async () => {
		const container = await mount(
			<Chart
				definition={lines}
				ariaLabel="Clubs et pros"
				brush={brushX({ onBrush: () => undefined })}
			/>,
		);
		const results = await axe.run(container);
		expect(results.violations.map((violation) => violation.id)).toEqual([]);
		expect(container.querySelectorAll("[role=slider]").length).toBe(2);
	});
});
