import { Chart, type ChartConfig } from "@voila.dev/ui-chart/components/chart";
import type { ReactNode } from "react";

const data = [
	{ month: "January", missions: 24, bookings: 18 },
	{ month: "February", missions: 31, bookings: 22 },
	{ month: "March", missions: 28, bookings: 25 },
	{ month: "April", missions: 35, bookings: 30 },
	{ month: "May", missions: 42, bookings: 36 },
	{ month: "June", missions: 38, bookings: 33 },
];

const config = {
	missions: { label: "Missions published", color: "var(--chart-1)" },
	bookings: { label: "Bookings confirmed", color: "var(--chart-2)" },
} satisfies ChartConfig;

const x = { key: "month" } as const;
const both = { keys: ["missions", "bookings"] } as const;
const one = { keys: ["missions"] } as const;
const shortMonth = (value: unknown) => `${value}`.slice(0, 3);

const FRAME = "w-full";
/** A bottom legend sits inside the root's box, so the margin makes room. */
const LEGEND_MARGIN = { top: 8, right: 8, bottom: 52, left: 40 } as const;
const PLAIN_MARGIN = { top: 8, right: 8, bottom: 28, left: 40 } as const;

/** A cartesian chart with the usual furniture, so each page varies one mark. */
function Cartesian({
	children,
	y = one,
	margin = PLAIN_MARGIN,
}: {
	readonly children: ReactNode;
	readonly y?: typeof one | typeof both;
	readonly margin?: {
		readonly top: number;
		readonly right: number;
		readonly bottom: number;
		readonly left: number;
	};
}) {
	return (
		<Chart.Root
			config={config}
			data={data}
			x={x}
			y={y}
			className={FRAME}
			margin={margin}
		>
			{children}
		</Chart.Root>
	);
}

const axes = (
	<>
		<Chart.XAxis tickFormatter={shortMonth} />
		<Chart.YAxis />
	</>
);

export const Bars = () => (
	<Cartesian y={both} margin={LEGEND_MARGIN}>
		<Chart.Grid />
		{axes}
		<Chart.Cursor />
		<Chart.Bars />
		<Chart.Tooltip />
		<Chart.Legend />
	</Cartesian>
);

export const Root = Bars;
export const Cursor = Bars;
export const Tooltip = Bars;
export const Legend = Bars;

export const BarsStacked = () => (
	<Chart.Root
		config={config}
		data={data}
		x={x}
		y={{ keys: ["missions", "bookings"], stacked: true }}
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

export const Area = () => (
	<Cartesian y={both} margin={LEGEND_MARGIN}>
		<Chart.Grid />
		{axes}
		<Chart.Cursor />
		<Chart.Area />
		<Chart.Tooltip />
		<Chart.Legend />
	</Cartesian>
);

export const Line = () => (
	<Cartesian>
		<Chart.Grid />
		{axes}
		<Chart.Cursor />
		<Chart.Line />
		<Chart.Tooltip />
	</Cartesian>
);

export const XAxis = Line;
export const YAxis = Line;

export const Points = () => (
	<Cartesian>
		<Chart.Grid />
		{axes}
		<Chart.Line />
		<Chart.Points />
		<Chart.Tooltip />
	</Cartesian>
);

export const Grid = () => (
	<Cartesian>
		<Chart.Grid horizontal vertical />
		{axes}
		<Chart.Line />
	</Cartesian>
);

export const LabelList = () => (
	<Cartesian margin={{ top: 20, right: 8, bottom: 28, left: 40 }}>
		{axes}
		<Chart.Bars />
		<Chart.LabelList marks="bars" />
	</Cartesian>
);

export const ReferenceLine = () => (
	<Cartesian>
		<Chart.Grid />
		{axes}
		<Chart.Line />
		<Chart.ReferenceLine value={30} label="Target" />
	</Cartesian>
);

export const Hero = Bars;

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
		y={{ keys: ["bookings", "missions"], stacked: true }}
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

const clubData = [
	{ club: "Alpha", missions: 12, spend: 4200 },
	{ club: "Bravo", missions: 26, spend: 9100 },
	{ club: "Charlie", missions: 18, spend: 6400 },
	{ club: "Delta", missions: 34, spend: 15800 },
	{ club: "Echo", missions: 9, spend: 2100 },
];

export const Bubble = () => (
	<Chart.Root
		config={{ missions: { label: "Missions", color: "var(--chart-4)" } }}
		data={clubData}
		x={{ key: "club", type: "point" }}
		y={{ keys: ["missions"] }}
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

const SQUARE = "mx-auto aspect-square w-full max-w-72";
const ROUND_MARGIN = { top: 0, right: 0, bottom: 48, left: 0 } as const;

const shareData = [
	{ specialty: "physiotherapy", providers: 86 },
	{ specialty: "osteopathy", providers: 54 },
	{ specialty: "nursing", providers: 37 },
	{ specialty: "medicine", providers: 21 },
];

const shareConfig = {
	providers: { label: "Providers" },
	physiotherapy: { label: "Physiotherapy", color: "var(--chart-1)" },
	osteopathy: { label: "Osteopathy", color: "var(--chart-2)" },
	nursing: { label: "Nursing", color: "var(--chart-3)" },
	medicine: { label: "Medicine", color: "var(--chart-4)" },
} satisfies ChartConfig;

function Round({ children }: { readonly children: ReactNode }) {
	return (
		<Chart.Root
			config={shareConfig}
			data={shareData}
			x={{ key: "specialty" }}
			y={{ keys: ["providers"] }}
			className={SQUARE}
			margin={ROUND_MARGIN}
			interactive={false}
		>
			{children}
			<Chart.Tooltip
				content={<Chart.TooltipContent nameKey="specialty" hideLabel />}
			/>
			<Chart.Legend content={<Chart.LegendContent nameKey="specialty" />} />
		</Chart.Root>
	);
}

export const Pie = () => (
	<Round>
		<Chart.Pie />
	</Round>
);

export const Slice = Pie;

export const Donut = () => (
	<Round>
		<Chart.Donut />
	</Round>
);

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

export const PolarGrid = Radar;
export const PolarAngleAxis = Radar;

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

export const Skeleton = () => <Chart.Skeleton className="h-56 w-full" />;

export const Empty = () => (
	<Chart.Empty className="h-56 w-full">No data for this period</Chart.Empty>
);
