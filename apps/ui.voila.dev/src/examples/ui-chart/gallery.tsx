import { Chart } from "@voila.dev/ui/chart";
import {
	axes,
	Cartesian,
	config,
	data,
	FRAME,
	LEGEND_MARGIN,
	one,
	x,
} from "./fixtures";

export const BarsHorizontal = () => (
	<Chart.Root
		config={config}
		data={data}
		x={x}
		y={one}
		orientation="horizontal"
		className={FRAME}
		margin={{ top: 4, right: 48, bottom: 4, left: 80 }}
	>
		<Chart.Grid horizontal={false} vertical />
		<Chart.YAxis />
		<Chart.Cursor />
		<Chart.Bars />
		<Chart.LabelList marks="bars" />
		<Chart.Tooltip />
	</Chart.Root>
);

const walletFlow = [
	{ month: "January", net: 420 },
	{ month: "February", net: -180 },
	{ month: "March", net: 260 },
	{ month: "April", net: -90 },
	{ month: "May", net: 540 },
	{ month: "June", net: 310 },
];

export const BarsNegative = () => (
	<Chart.Root
		config={{ net: { label: "Net wallet flow" } }}
		data={walletFlow}
		x={x}
		y={{ keys: ["net"] }}
		className={FRAME}
	>
		<Chart.Grid />
		{axes}
		<Chart.ReferenceLine value={0} label="" />
		<Chart.Bars
			fill={(datum) =>
				Number(datum.net) >= 0 ? "var(--chart-2)" : "var(--chart-5)"
			}
		/>
		<Chart.Tooltip />
	</Chart.Root>
);

export const LineStep = () => (
	<Cartesian>
		<Chart.Grid />
		{axes}
		<Chart.Line curve="step" dots />
		<Chart.Tooltip />
	</Cartesian>
);

export const AreaStacked = () => (
	<Chart.Root
		config={config}
		data={data}
		x={x}
		y={{ keys: ["proposals", "projects"], stacked: true }}
		className={FRAME}
		margin={LEGEND_MARGIN}
	>
		<Chart.Grid />
		{axes}
		<Chart.Area gradient={false} />
		<Chart.Tooltip />
		<Chart.Legend />
	</Chart.Root>
);

const clientData = [
	{ client: "Alpha", projects: 12, spend: 4200 },
	{ client: "Bravo", projects: 26, spend: 9100 },
	{ client: "Charlie", projects: 18, spend: 6400 },
	{ client: "Delta", projects: 34, spend: 15800 },
	{ client: "Echo", projects: 9, spend: 2100 },
];

export const Bubble = () => (
	<Chart.Root
		config={{ projects: { label: "Projects", color: "var(--chart-4)" } }}
		data={clientData}
		x={{ key: "client", type: "point" }}
		y={{ keys: ["projects"] }}
		className={FRAME}
		margin={{ top: 16, right: 24, bottom: 24, left: 40 }}
	>
		<Chart.Grid vertical />
		<Chart.XAxis />
		<Chart.YAxis />
		<Chart.Points sizeKey="spend" />
		<Chart.Tooltip />
	</Chart.Root>
);

// --- polar ---------------------------------------------------------------
