import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	areaY,
	barX,
	barY,
	cell,
	defineChart,
	dot,
	lineY,
	ruleY,
} from "@voila.dev/chart";
import { CanvasRenderer } from "@voila.dev/chart/canvas";
import { Chart } from "@voila.dev/chart/react";
import { expect, userEvent, within } from "storybook/test";

const months = [
	{ month: new Date("2026-01-01"), missions: 24, bookings: 18 },
	{ month: new Date("2026-02-01"), missions: 31, bookings: 22 },
	{ month: new Date("2026-03-01"), missions: 28, bookings: 25 },
	{ month: new Date("2026-04-01"), missions: 35, bookings: 30 },
	{ month: new Date("2026-05-01"), missions: 42, bookings: 36 },
	{ month: new Date("2026-06-01"), missions: 38, bookings: 33 },
];

const byKind = months.flatMap((row) => [
	{ month: row.month, kind: "Clubs", value: row.missions },
	{ month: row.month, kind: "Cabinets", value: row.bookings },
]);

const cities = [
	{ city: "Nantes", missions: 42 },
	{ city: "Lyon", missions: 35 },
	{ city: "Bordeaux", missions: 28 },
	{ city: "Lille", missions: 19 },
	{ city: "Strasbourg", missions: 11 },
];

const meta = {
	title: "Chart/Definition",
	component: Chart,
	tags: ["autodocs"],
	parameters: {
		docs: {
			description: {
				component:
					"`@voila.dev/chart`: a chart is a definition of marks (`lineY`, `barY`, `areaY`, `dot`, `cell`, `ruleY`…) passed to `<Chart>`. Every chart is reachable with Tab and walked with the arrow keys; the live region reads the focused value and a hidden table lists them all. Pass `renderer={CanvasRenderer}` to paint on a canvas instead of SVG.",
			},
		},
	},
	args: { className: "w-full max-w-xl" },
} satisfies Meta<typeof Chart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Lines: Story = {
	args: {
		ariaLabel: "Missions et réservations par mois",
		definition: defineChart({
			marks: [
				lineY(months, { x: "month", y: "missions", label: "Missions" }),
				lineY(months, {
					x: "month",
					y: "bookings",
					label: "Réservations",
					strokeDasharray: "4 4",
				}),
			],
		}),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.tab();
		await userEvent.keyboard("{ArrowRight}");
		await expect(canvas.getByRole("img")).toHaveFocus();
	},
};

export const StackedBars: Story = {
	args: {
		ariaLabel: "Missions par mois et par type d'entreprise",
		definition: defineChart({
			marks: [barY(byKind, { x: "month", y: "value", color: "kind" })],
		}),
	},
};

export const GroupedBars: Story = {
	args: {
		ariaLabel: "Missions par mois et par type d'entreprise",
		definition: defineChart({
			marks: [
				barY(byKind, { x: "month", y: "value", color: "kind", group: true }),
			],
		}),
	},
};

export const HorizontalBars: Story = {
	args: {
		ariaLabel: "Missions par ville",
		definition: defineChart({
			marks: [barX(cities, { x: "missions", y: "city", label: "Missions" })],
		}),
	},
};

export const StackedArea: Story = {
	args: {
		ariaLabel: "Missions par type d'entreprise",
		definition: defineChart({
			marks: [
				areaY(byKind, { x: "month", y: "value", color: "kind", line: true }),
			],
		}),
	},
};

export const TargetLine: Story = {
	args: {
		ariaLabel: "Missions par mois et objectif",
		definition: defineChart({
			marks: [
				barY(months, { x: "month", y: "missions", label: "Missions" }),
				ruleY([40], { label: "Objectif", strokeDasharray: "4 4" }),
			],
		}),
	},
};

export const Scatter: Story = {
	args: {
		ariaLabel: "Tarif et note des pros",
		definition: defineChart({
			x: { label: "Tarif horaire (€)" },
			y: { label: "Note" },
			marks: [
				dot(
					Array.from({ length: 40 }, (_unused, index) => ({
						rate: 30 + ((index * 37) % 50),
						rating: 3 + ((index * 13) % 20) / 10,
						reviews: 1 + ((index * 7) % 30),
					})),
					{ x: "rate", y: "rating", r: "reviews", fillOpacity: 0.6 },
				),
			],
		}),
	},
};

const hours = ["8h", "10h", "12h", "14h", "16h", "18h"];
const days = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];

export const Heatmap: Story = {
	args: {
		ariaLabel: "Missions par jour et par heure",
		definition: defineChart({
			marks: [
				cell(
					days.flatMap((day, dayIndex) =>
						hours.map((hour, hourIndex) => ({
							day,
							hour,
							missions: (dayIndex * 3 + hourIndex * 5) % 11,
						})),
					),
					{ x: "day", y: "hour", color: "missions" },
				),
			],
		}),
	},
};

export const CanvasLines: Story = {
	args: {
		...Lines.args,
		ariaLabel: "Missions et réservations par mois (canvas)",
		definition: Lines.args?.definition ?? defineChart({ marks: [] }),
		renderer: CanvasRenderer,
	},
};

export const ThousandPointsOnCanvas: Story = {
	args: {
		ariaLabel: "Mille mesures",
		renderer: CanvasRenderer,
		definition: defineChart({
			marks: [
				lineY(
					Array.from({ length: 1000 }, (_unused, index) => ({
						at: new Date(Date.UTC(2026, 0, 1) + index * 3_600_000),
						value: 50 + 20 * Math.sin(index / 30) + ((index * 17) % 9),
					})),
					{ x: "at", y: "value", label: "Mesure", strokeWidth: 1.5 },
				),
			],
		}),
	},
};
