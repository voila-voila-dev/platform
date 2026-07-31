import { Chart } from "@voila.dev/ui/chart";

const RADAR_INSET = 92;

const coverage = [
	{ region: "North", coverage: 92 },
	{ region: "West", coverage: 68 },
	{ region: "South", coverage: 74 },
	{ region: "East", coverage: 85 },
	{ region: "Central", coverage: 61 },
];

export const Radar = () => (
	<Chart.Root
		config={{ coverage: { label: "Coverage", color: "var(--chart-1)" } }}
		data={coverage}
		x={{ key: "region" }}
		y={{ keys: ["coverage"], domain: [0, 100] }}
		className="mx-auto aspect-square w-full max-w-96"
		margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
		interactive={false}
	>
		<Chart.PolarGrid inset={RADAR_INSET} />
		<Chart.PolarAngleAxis inset={RADAR_INSET} />
		<Chart.Radar dots inset={RADAR_INSET} />
	</Chart.Root>
);
