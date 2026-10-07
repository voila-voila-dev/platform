import {
	areaY,
	barX,
	barY,
	boxY,
	cell,
	defineChart,
	donut,
	dot,
	facet,
	funnel,
	histogram,
	lineY,
	radar,
	regressionY,
	ruleX,
	ruleY,
} from "@voila.dev/chart";
import { brushX } from "@voila.dev/chart/brush";
import { CanvasRenderer } from "@voila.dev/chart/canvas";
import { treemap } from "@voila.dev/chart/hierarchy";
import { Chart } from "@voila.dev/chart/react";
import { sankey } from "@voila.dev/chart/sankey";
import { useState } from "react";

/** The package formats in French by default; this site is in English. */
const LOCALE = "en-GB";

const months = [0, 1, 2, 3, 4, 5].map((index) => ({
	month: new Date(Date.UTC(2026, index, 1)),
	bookings: [18, 22, 25, 30, 36, 33][index],
	projects: [24, 31, 28, 35, 42, 38][index],
}));

const byKind = months.flatMap((row) => [
	{ month: row.month, kind: "Projects", value: row.projects },
	{ month: row.month, kind: "Bookings", value: row.bookings },
]);

const cities = [
	{ city: "Paris", projects: 51 },
	{ city: "Lyon", projects: 35 },
	{ city: "Nantes", projects: 28 },
	{ city: "Lille", projects: 19 },
];

/** A seeded stream, so every visit draws the same picture. */
function random(seed: number) {
	let state = seed;
	return () => {
		state = (state * 1664525 + 1013904223) % 4294967296;
		return state / 4294967296;
	};
}
const next = random(3);
const durations = ["Design", "Build", "Review"].flatMap((stage, index) =>
	Array.from({ length: 40 }, () => ({
		stage,
		days: Math.max(1, 3 + index * 2 + (next() - 0.5) * 6 + (next() - 0.5) * 4),
	})),
);
const pairs = Array.from({ length: 120 }, () => {
	const size = 10 + next() * 90;
	return { size, hours: size * 0.6 + (next() - 0.5) * 30 };
});

export function QuickStart() {
	return (
		<Chart
			ariaLabel="Bookings per month"
			height={240}
			definition={defineChart({
				locale: LOCALE,
				marks: [
					lineY(months, { x: "month", y: "bookings", label: "Bookings" }),
				],
			})}
		/>
	);
}

export function Composed() {
	return (
		<Chart
			ariaLabel="Projects per month, against a target of 40"
			height={260}
			definition={defineChart({
				locale: LOCALE,
				marks: [
					barY(months, { x: "month", y: "projects", label: "Projects" }),
					lineY(months, {
						x: "month",
						y: "bookings",
						label: "Bookings",
						stroke: "var(--chart-2)",
						dots: true,
					}),
					ruleY([40], { label: "Target", strokeDasharray: "4 4" }),
				],
			})}
		/>
	);
}

export function StackedBars() {
	return (
		<Chart
			ariaLabel="Projects and bookings per month"
			height={240}
			definition={defineChart({
				locale: LOCALE,
				marks: [barY(byKind, { x: "month", y: "value", color: "kind" })],
			})}
		/>
	);
}

export function HorizontalBars() {
	return (
		<Chart
			ariaLabel="Projects per city"
			height={200}
			definition={defineChart({
				locale: LOCALE,
				marks: [barX(cities, { x: "projects", y: "city", label: "Projects" })],
			})}
		/>
	);
}

export function StackedArea() {
	return (
		<Chart
			ariaLabel="Projects and bookings per month"
			height={240}
			definition={defineChart({
				locale: LOCALE,
				marks: [
					areaY(byKind, { x: "month", y: "value", color: "kind", line: true }),
				],
			})}
		/>
	);
}

export function Projected() {
	return (
		<Chart
			ariaLabel="Projects per month, the last two projected"
			height={240}
			definition={defineChart({
				locale: LOCALE,
				marks: [
					barY(months, {
						x: "month",
						y: "projects",
						label: "Projects",
						projected: (_row, index) => index >= 4,
					}),
					ruleX([months[4].month], { label: "Today", position: "before" }),
				],
			})}
		/>
	);
}

export function Donut() {
	return (
		<Chart
			ariaLabel="Projects per city"
			height={240}
			definition={defineChart({
				locale: LOCALE,
				marks: [donut(cities, { category: "city", value: "projects" })],
			})}
		/>
	);
}

export function Radar() {
	return (
		<Chart
			ariaLabel="Two profiles compared"
			height={260}
			definition={defineChart({
				locale: LOCALE,
				marks: [
					radar(
						["Speed", "Quality", "Cost", "Scope", "Risk"].flatMap(
							(axis, index) => [
								{ axis, team: "Team A", score: 4 + (index % 3) * 2 },
								{ axis, team: "Team B", score: 9 - index },
							],
						),
						{ axis: "axis", value: "score", color: "team", max: 10 },
					),
				],
			})}
		/>
	);
}

export function Funnel() {
	return (
		<Chart
			ariaLabel="From visit to booking"
			height={220}
			definition={defineChart({
				locale: LOCALE,
				marks: [
					funnel(
						[
							{ step: "Visits", count: 4200 },
							{ step: "Sign-ups", count: 980 },
							{ step: "Projects", count: 610 },
							{ step: "Bookings", count: 240 },
						],
						{ category: "step", value: "count" },
					),
				],
			})}
		/>
	);
}

export function Statistics() {
	return (
		<Chart
			ariaLabel="Days per stage"
			height={240}
			definition={defineChart({
				locale: LOCALE,
				marks: [
					boxY(durations, { category: "stage", value: "days", label: "Days" }),
				],
			})}
		/>
	);
}

export function Histogram() {
	return (
		<Chart
			ariaLabel="Days per task"
			height={220}
			definition={defineChart({
				locale: LOCALE,
				marks: [histogram(durations, { x: "days", bins: 14, label: "Tasks" })],
			})}
		/>
	);
}

export function Regression() {
	return (
		<Chart
			ariaLabel="Hours against size"
			height={240}
			definition={defineChart({
				locale: LOCALE,
				x: { label: "Size" },
				y: { label: "Hours" },
				marks: [
					dot(pairs, { x: "size", y: "hours", r: 2.5, fillOpacity: 0.6 }),
					regressionY(pairs, { x: "size", y: "hours", label: "Trend" }),
				],
			})}
		/>
	);
}

export function Heatmap() {
	const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
	const hours = ["9h", "11h", "14h", "16h"];
	return (
		<Chart
			ariaLabel="Bookings per day and hour"
			height={200}
			definition={defineChart({
				locale: LOCALE,
				marks: [
					cell(
						days.flatMap((day, dayIndex) =>
							hours.map((hour, hourIndex) => ({
								day,
								hour,
								bookings: (dayIndex * 3 + hourIndex * 5) % 11,
							})),
						),
						{ x: "day", y: "hour", color: "bookings" },
					),
				],
			})}
		/>
	);
}

interface Team {
	readonly name: string;
	readonly n?: number;
	readonly children?: ReadonlyArray<Team>;
}

const teams: Team = {
	name: "All",
	children: [
		{
			name: "Web",
			children: [
				{ name: "Sites", n: 40 },
				{ name: "Apps", n: 25 },
			],
		},
		{
			name: "Mobile",
			children: [
				{ name: "iOS", n: 18 },
				{ name: "Android", n: 14 },
			],
		},
		{ name: "Data", children: [{ name: "Reports", n: 12 }] },
	],
};

export function Treemap() {
	return (
		<Chart
			ariaLabel="Projects per team and type"
			height={240}
			definition={defineChart({
				locale: LOCALE,
				marks: [
					treemap(teams, {
						name: (team) => team.name,
						value: (team) => team.n ?? 0,
						label: "Projects",
					}),
				],
			})}
		/>
	);
}

export function Sankey() {
	return (
		<Chart
			ariaLabel="From visit to booking"
			height={240}
			definition={defineChart({
				locale: LOCALE,
				marks: [
					sankey({
						nodes: [
							{ id: "visits", label: "Visits" },
							{ id: "signups", label: "Sign-ups" },
							{ id: "projects", label: "Projects" },
							{ id: "bookings", label: "Bookings" },
							{ id: "lost", label: "Dropped" },
						],
						links: [
							{ source: "visits", target: "signups", value: 980 },
							{ source: "signups", target: "projects", value: 610 },
							{ source: "projects", target: "bookings", value: 240 },
							{ source: "projects", target: "lost", value: 370 },
						],
					}),
				],
			})}
		/>
	);
}

const daily = Array.from({ length: 120 }, (_unused, index) => ({
	day: new Date(Date.UTC(2026, 0, 1 + index)),
	bookings: Math.round(20 + 10 * Math.sin(index / 9) + (index % 7) * 2),
}));

export function Zoom() {
	return (
		<Chart
			ariaLabel="Bookings per day"
			height={240}
			zoom
			definition={defineChart({
				locale: LOCALE,
				marks: [lineY(daily, { x: "day", y: "bookings", label: "Bookings" })],
			})}
		/>
	);
}

export function Brush() {
	const [range, setRange] = useState<readonly [unknown, unknown] | null>(null);
	const day = (value: unknown) =>
		value instanceof Date ? value.toLocaleDateString("en-GB") : String(value);
	return (
		<div className="grid gap-2">
			<Chart
				ariaLabel="Bookings per day"
				height={240}
				brush={brushX({ onBrush: setRange })}
				definition={defineChart({
					locale: LOCALE,
					marks: [lineY(daily, { x: "day", y: "bookings", label: "Bookings" })],
				})}
			/>
			<p className="text-muted-foreground text-sm">
				{range
					? `${day(range[0])} → ${day(range[1])}`
					: "Drag across the chart, or use the handles from the keyboard."}
			</p>
		</div>
	);
}

export function SmallMultiples() {
	return (
		<Chart
			ariaLabel="Projects per month, city by city"
			height={300}
			definition={defineChart({
				locale: LOCALE,
				facet: facet({
					values: ["Paris", "Lyon", "Nantes"],
					marks: (city) => [
						barY(
							months.map((row, index) => ({
								month: row.month,
								projects:
									(row.projects *
										(3 - ["Paris", "Lyon", "Nantes"].indexOf(String(city)))) /
										3 +
									index,
							})),
							{ x: "month", y: "projects", label: "Projects" },
						),
					],
				}),
			})}
		/>
	);
}

export function OnCanvas() {
	return (
		<Chart
			ariaLabel="Bookings per day, on a canvas"
			height={240}
			renderer={CanvasRenderer}
			definition={defineChart({
				locale: LOCALE,
				marks: [lineY(daily, { x: "day", y: "bookings", label: "Bookings" })],
			})}
		/>
	);
}
