import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { barY, defineChart, facet, lineY } from "@voila.dev/chart";
import { brushX } from "@voila.dev/chart/brush";
import { Chart } from "@voila.dev/chart/react";
import { useState } from "react";

const daily = Array.from({ length: 180 }, (_unused, index) => ({
	day: new Date(Date.UTC(2026, 0, 1 + index)),
	missions: Math.round(20 + 10 * Math.sin(index / 9) + (index % 7) * 2),
}));

const meta = {
	title: "Chart/Interaction",
	component: Chart,
	tags: ["autodocs"],
	args: { className: "w-full max-w-xl" },
} satisfies Meta<typeof Chart>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Focus the chart, then the wheel, + and −, Shift and the arrows, a drag, or 0. */
export const Zoom: Story = {
	args: {
		ariaLabel: "Missions par jour",
		zoom: true,
		definition: defineChart({
			marks: [lineY(daily, { x: "day", y: "missions", label: "Missions" })],
		}),
	},
};

function BrushedChart() {
	const [range, setRange] = useState<readonly [unknown, unknown] | null>(null);
	const format = (value: unknown) =>
		value instanceof Date ? value.toLocaleDateString("fr-FR") : String(value);
	return (
		<div className="grid w-full max-w-xl gap-2">
			<Chart
				ariaLabel="Missions par jour"
				definition={defineChart({
					marks: [lineY(daily, { x: "day", y: "missions", label: "Missions" })],
				})}
				brush={brushX({ onBrush: setRange })}
			/>
			<p className="text-muted-foreground text-sm">
				{range
					? `${format(range[0])} → ${format(range[1])}`
					: "Faites glisser sur le graphique, ou utilisez les poignées au clavier."}
			</p>
		</div>
	);
}

export const Brush: Story = {
	args: { ariaLabel: "", definition: defineChart({ marks: [] }) },
	render: () => <BrushedChart />,
};

const cities = ["Nantes", "Lyon", "Bordeaux", "Lille", "Marseille", "Paris"];
const months = ["janv.", "févr.", "mars", "avr."];
const byCity = cities.flatMap((city, cityIndex) =>
	months.map((month, monthIndex) => ({
		city,
		month,
		missions: 5 + ((cityIndex * 7 + monthIndex * 5) % 23),
	})),
);

export const Facets: Story = {
	args: {
		ariaLabel: "Missions par mois, ville par ville",
		height: 360,
		definition: defineChart({
			facet: facet({
				values: cities,
				columns: 3,
				marks: (city) => [
					barY(
						byCity.filter((row) => row.city === city),
						{ x: "month", y: "missions", label: "Missions" },
					),
				],
			}),
		}),
	},
};
