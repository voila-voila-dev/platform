import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { defineChart } from "@voila.dev/chart";
import { geoDot, geoShape, projection } from "@voila.dev/chart/geo";
import { Chart } from "@voila.dev/chart/react";

const REGIONS_URL =
	"https://cdn.jsdelivr.net/gh/gregoiredavid/france-geojson@master/regions-version-simplifiee.geojson";

interface Region {
	readonly type: "Feature";
	readonly properties: { readonly nom: string; readonly code: string };
	readonly geometry: unknown;
}

const cities = [
	{ city: "Nantes", lon: -1.55, lat: 47.22, missions: 42 },
	{ city: "Lyon", lon: 4.84, lat: 45.76, missions: 35 },
	{ city: "Bordeaux", lon: -0.58, lat: 44.84, missions: 28 },
	{ city: "Lille", lon: 3.06, lat: 50.63, missions: 19 },
	{ city: "Marseille", lon: 5.37, lat: 43.3, missions: 24 },
	{ city: "Paris", lon: 2.35, lat: 48.86, missions: 51 },
];

const meta = {
	title: "Chart/Map",
	component: Chart,
	tags: ["autodocs"],
	args: { className: "w-full max-w-xl" },
	loaders: [
		async () => {
			const response = await fetch(REGIONS_URL);
			const collection = (await response.json()) as { features: Region[] };
			return { regions: collection };
		},
	],
} satisfies Meta<typeof Chart>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Synthetic missions per region: the code digits, so the picture is stable. */
function missionsIn(region: Region): number {
	return (Number(region.properties.code) * 7) % 60;
}

export const Choropleth: Story = {
	args: {
		ariaLabel: "Missions par région",
		height: 420,
		definition: defineChart({ marks: [] }),
	},
	render: (args, { loaded }) => {
		const regions = loaded.regions as {
			type: "FeatureCollection";
			features: Region[];
		};
		const metropole = regions.features.filter(
			(region) => Number(region.properties.code) > 10,
		);
		return (
			<Chart
				{...args}
				definition={defineChart({
					projection: projection("france", {
						domain: { ...regions, features: metropole } as never,
					}),
					marks: [
						geoShape(metropole, {
							name: (region) => region.properties.nom,
							color: missionsIn,
							label: "Missions",
						}),
						geoDot(cities, {
							longitude: "lon",
							latitude: "lat",
							name: "city",
							r: "missions",
							value: "missions",
							label: "Missions",
						}),
					],
				})}
			/>
		);
	},
};
