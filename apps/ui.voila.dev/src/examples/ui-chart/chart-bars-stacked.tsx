import { Chart } from "@voila.dev/ui/chart";
import { axes, config, data, FRAME, LEGEND_MARGIN, x } from "./fixtures";

export const BarsStacked = () => (
	<Chart.Root
		config={config}
		data={data}
		x={x}
		y={{ keys: ["projects", "proposals"], stacked: true }}
		className={FRAME}
		margin={LEGEND_MARGIN}
	>
		<Chart.Grid />
		{axes}
		<Chart.Cursor />
		<Chart.Bars />
		<Chart.Tooltip />
		<Chart.Legend />
	</Chart.Root>
);
