import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	boxY,
	defineChart,
	differenceY,
	dodgeY,
	dot,
	hexbin,
	histogram,
	regressionY,
	ridgeline,
	violinY,
	waffleY,
} from "@voila.dev/chart";
import { density2d } from "@voila.dev/chart/contour";
import { Chart } from "@voila.dev/chart/react";
import { voronoi } from "@voila.dev/chart/voronoi";

/** A seeded pseudo-random stream, so every story draws the same picture. */
function random(seed: number) {
	let state = seed;
	return () => {
		state = (state * 1664525 + 1013904223) % 4294967296;
		return state / 4294967296;
	};
}

function normal(next: () => number, mean: number, deviation: number): number {
	const u = Math.max(next(), 1e-9);
	return (
		mean +
		deviation * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * next())
	);
}

const next = random(7);
const durations = ["Kiné", "Médecin", "Ostéopathe", "Infirmier"].flatMap(
	(profession, index) =>
		Array.from({ length: 60 }, () => ({
			profession,
			hours: Math.max(1, normal(next, 4 + index * 1.5, 1 + index * 0.4)),
		})),
);
const pairs = Array.from({ length: 300 }, () => {
	const rate = normal(next, 55, 12);
	return {
		rate,
		rating: Math.min(5, Math.max(1, 2 + rate / 30 + normal(next, 0, 0.4))),
	};
});

const meta = {
	title: "Chart/Statistics",
	component: Chart,
	tags: ["autodocs"],
	args: { className: "w-full max-w-xl" },
} satisfies Meta<typeof Chart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Histogram: Story = {
	args: {
		ariaLabel: "Durée des missions",
		definition: defineChart({
			x: { label: "Heures" },
			marks: [
				histogram(durations, { x: "hours", bins: 16, label: "Missions" }),
			],
		}),
	},
};

export const BoxPlot: Story = {
	args: {
		ariaLabel: "Durée des missions par profession",
		definition: defineChart({
			marks: [
				boxY(durations, {
					category: "profession",
					value: "hours",
					label: "Heures",
				}),
			],
		}),
	},
};

export const Violin: Story = {
	args: {
		ariaLabel: "Durée des missions par profession",
		definition: defineChart({
			marks: [
				violinY(durations, {
					category: "profession",
					value: "hours",
					label: "Heures",
				}),
			],
		}),
	},
};

export const Ridgeline: Story = {
	args: {
		ariaLabel: "Durée des missions par profession",
		definition: defineChart({
			marks: [
				ridgeline(durations, {
					category: "profession",
					value: "hours",
					label: "Heures",
				}),
			],
		}),
	},
};

export const Beeswarm: Story = {
	args: {
		ariaLabel: "Durée de chaque mission",
		height: 200,
		definition: defineChart({
			marks: [
				dodgeY(durations.slice(0, 120), {
					x: "hours",
					color: "profession",
					r: 4,
				}),
			],
		}),
	},
};

export const Waffle: Story = {
	args: {
		ariaLabel: "Missions par profession",
		definition: defineChart({
			marks: [
				waffleY(
					[
						{ profession: "Kiné", missions: 48 },
						{ profession: "Médecin", missions: 21 },
						{ profession: "Ostéopathe", missions: 14 },
					],
					{ x: "profession", y: "missions", columns: 8, label: "Missions" },
				),
			],
		}),
	},
};

export const Difference: Story = {
	args: {
		ariaLabel: "Recettes et dépenses par mois",
		definition: defineChart({
			marks: [
				differenceY(
					Array.from({ length: 12 }, (_unused, month) => ({
						month: new Date(Date.UTC(2026, month, 1)),
						income: 40 + 15 * Math.sin(month / 2),
						costs: 45 + 5 * Math.cos(month / 3),
					})),
					{
						x: "month",
						y1: "income",
						y2: "costs",
						labels: ["Recettes", "Dépenses"],
					},
				),
			],
		}),
	},
};

export const RegressionOverScatter: Story = {
	args: {
		ariaLabel: "Note selon le tarif",
		definition: defineChart({
			x: { label: "Tarif (€)" },
			y: { label: "Note" },
			marks: [
				dot(pairs, { x: "rate", y: "rating", r: 2.5, fillOpacity: 0.5 }),
				regressionY(pairs, { x: "rate", y: "rating", label: "Tendance" }),
			],
		}),
	},
};

export const Hexbin: Story = {
	args: {
		ariaLabel: "Note selon le tarif",
		definition: defineChart({
			marks: [
				hexbin(pairs, { x: "rate", y: "rating", radius: 12, label: "Pros" }),
			],
		}),
	},
};

export const DensityContours: Story = {
	args: {
		ariaLabel: "Note selon le tarif",
		definition: defineChart({
			marks: [
				density2d(pairs, { x: "rate", y: "rating", bandwidth: 18 }),
				dot(pairs, { x: "rate", y: "rating", r: 1.5 }),
			],
		}),
	},
};

export const Voronoi: Story = {
	args: {
		ariaLabel: "Note selon le tarif",
		definition: defineChart({
			marks: [
				voronoi(pairs.slice(0, 80), { x: "rate", y: "rating" }),
				dot(pairs.slice(0, 80), { x: "rate", y: "rating", r: 2.5 }),
			],
		}),
	},
};
