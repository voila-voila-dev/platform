import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { defineChart } from "@voila.dev/chart";
import { forceGraph } from "@voila.dev/chart/force";
import { sunburst, tree, treemap } from "@voila.dev/chart/hierarchy";
import { Chart } from "@voila.dev/chart/react";
import { sankey } from "@voila.dev/chart/sankey";

interface Branch {
	name: string;
	missions?: number;
	children?: Branch[];
}

const activity: Branch = {
	name: "Missions",
	children: [
		{
			name: "Kiné",
			children: [
				{ name: "Football", missions: 42 },
				{ name: "Rugby", missions: 28 },
				{ name: "Handball", missions: 15 },
				{ name: "Basket", missions: 9 },
			],
		},
		{
			name: "Médecin",
			children: [
				{ name: "Football", missions: 18 },
				{ name: "Rugby", missions: 12 },
			],
		},
		{
			name: "Ostéopathe",
			children: [
				{ name: "Football", missions: 11 },
				{ name: "Athlétisme", missions: 6 },
			],
		},
	],
};

const hierarchyOptions = {
	name: (node: Branch) => node.name,
	value: (node: Branch) => node.missions ?? 0,
	label: "Missions",
};

const meta = {
	title: "Chart/Networks",
	component: Chart,
	tags: ["autodocs"],
	args: { className: "w-full max-w-xl" },
} satisfies Meta<typeof Chart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Treemap: Story = {
	args: {
		ariaLabel: "Missions par profession et par sport",
		definition: defineChart({ marks: [treemap(activity, hierarchyOptions)] }),
	},
};

export const Sunburst: Story = {
	args: {
		ariaLabel: "Missions par profession et par sport",
		height: 340,
		definition: defineChart({ marks: [sunburst(activity, hierarchyOptions)] }),
	},
};

export const Tree: Story = {
	args: {
		ariaLabel: "Missions par profession et par sport",
		height: 340,
		definition: defineChart({ marks: [tree(activity, hierarchyOptions)] }),
	},
};

export const Sankey: Story = {
	args: {
		ariaLabel: "Du visiteur à la mission",
		definition: defineChart({
			marks: [
				sankey(
					{
						nodes: [
							{ id: "visits", label: "Visites" },
							{ id: "clubs", label: "Clubs inscrits" },
							{ id: "pros", label: "Pros inscrits" },
							{ id: "posted", label: "Missions publiées" },
							{ id: "booked", label: "Missions pourvues" },
							{ id: "lost", label: "Abandons" },
						],
						links: [
							{ source: "visits", target: "clubs", value: 120 },
							{ source: "visits", target: "pros", value: 340 },
							{ source: "clubs", target: "posted", value: 90 },
							{ source: "pros", target: "booked", value: 70 },
							{ source: "posted", target: "booked", value: 70 },
							{ source: "posted", target: "lost", value: 20 },
						],
					},
					{ label: "Personnes" },
				),
			],
		}),
	},
};

export const ForceGraph: Story = {
	args: {
		ariaLabel: "Clubs et pros qui ont travaillé ensemble",
		height: 360,
		definition: defineChart({
			marks: [
				forceGraph(
					{
						nodes: [
							...["FC Nantes", "Stade Rennais", "HBC Nantes", "RC Vannes"].map(
								(id) => ({ id, group: "Clubs" }),
							),
							...["Nathan", "Léa", "Hugo", "Inès", "Paul", "Chloé"].map(
								(id) => ({ id, group: "Pros" }),
							),
						],
						links: [
							{ source: "Nathan", target: "FC Nantes" },
							{ source: "Nathan", target: "HBC Nantes" },
							{ source: "Léa", target: "FC Nantes" },
							{ source: "Hugo", target: "Stade Rennais" },
							{ source: "Inès", target: "Stade Rennais" },
							{ source: "Inès", target: "RC Vannes" },
							{ source: "Paul", target: "RC Vannes" },
							{ source: "Chloé", target: "HBC Nantes" },
							{ source: "Chloé", target: "FC Nantes" },
						],
					},
					{ labels: true, radius: 6 },
				),
			],
		}),
	},
};
