import { Chart } from "@voila.dev/ui/chart";
import { ROUND_MARGIN, SQUARE } from "./fixtures";

export const RadialBar = () => (
	<Chart.Root
		config={{
			fillRate: { label: "Fill rate", color: "var(--chart-2)" },
			responseRate: { label: "Response rate", color: "var(--chart-1)" },
			repeatRate: { label: "Repeat rate", color: "var(--chart-4)" },
		}}
		data={[
			{ metric: "fillRate", value: 78 },
			{ metric: "responseRate", value: 64 },
			{ metric: "repeatRate", value: 41 },
		]}
		x={{ key: "metric" }}
		y={{ keys: ["value"], domain: [0, 100] }}
		className={SQUARE}
		margin={ROUND_MARGIN}
		interactive={false}
	>
		<Chart.RadialBar />
		<Chart.Tooltip
			content={<Chart.TooltipContent nameKey="metric" hideLabel />}
		/>
		<Chart.Legend content={<Chart.LegendContent nameKey="metric" />} />
	</Chart.Root>
);
