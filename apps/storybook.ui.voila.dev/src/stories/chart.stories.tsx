import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Chart, type ChartConfig } from "@voila.dev/ui-chart/components/chart";
import { expect, fireEvent, within } from "storybook/test";

const chartData = [
	{ month: "January", missions: 24, bookings: 18 },
	{ month: "February", missions: 31, bookings: 22 },
	{ month: "March", missions: 28, bookings: 25 },
	{ month: "April", missions: 35, bookings: 30 },
	{ month: "May", missions: 42, bookings: 36 },
	{ month: "June", missions: 38, bookings: 33 },
];

const chartConfig = {
	missions: { label: "Missions published", color: "var(--chart-1)" },
	bookings: { label: "Bookings confirmed", color: "var(--chart-2)" },
} satisfies ChartConfig;

const monthAxis = { key: "month" } as const;
const bothSeries = { keys: ["missions", "bookings"] } as const;

const meta = {
	title: "UI/Chart",
	component: Chart.Root,
	tags: ["autodocs"],
	parameters: {
		docs: {
			description: {
				component:
					"Composable SVG charts. `Chart.Root` measures itself, derives the scales and owns the active datum; every other part draws into it. Pointer, touch and keyboard all drive the same active index, and the numbers are always available as a visually hidden data table.",
			},
		},
	},
} satisfies Meta<typeof Chart.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Every story is drawn in the same box, so shapes are comparable. */
const frame = "w-full max-w-xl";
const square = "mx-auto aspect-square w-full max-w-72";
/** A bottom legend sits in the root's own box, so the margin has to make room. */
const legendMargin = { top: 8, right: 8, bottom: 52, left: 40 } as const;
/** Radar labels are drawn outside the ring, so the ring has to leave room. */
const radarInset = 92;

export const Bars: Story = {
	args: {
		config: chartConfig,
		data: chartData,
		x: monthAxis,
		y: bothSeries,
		className: frame,
		margin: legendMargin,
		children: (
			<>
				<Chart.Grid />
				<Chart.XAxis tickFormatter={(value) => `${value}`.slice(0, 3)} />
				<Chart.YAxis />
				<Chart.Cursor />
				<Chart.Bars />
				<Chart.Tooltip />
				<Chart.Legend />
			</>
		),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const chart = canvas.getByRole("img");
		await expect(chart).toHaveAttribute("aria-label");
		// Arrowing into the chart selects the first month and announces it.
		fireEvent.keyDown(chart, { key: "ArrowRight" });
		// The readout portals to the document body so a clipping ancestor cannot
		// cut it in half, which puts it outside the story canvas.
		await expect(
			await within(document.body).findByRole("status"),
		).toHaveTextContent("January");
	},
};

export const BarsStacked: Story = {
	args: {
		config: chartConfig,
		data: chartData,
		x: monthAxis,
		y: { keys: ["missions", "bookings"], stacked: true },
		className: frame,
		margin: legendMargin,
		children: (
			<>
				<Chart.Grid />
				<Chart.XAxis tickFormatter={(value) => `${value}`.slice(0, 3)} />
				<Chart.YAxis />
				<Chart.Cursor />
				<Chart.Bars />
				<Chart.Tooltip />
				<Chart.Legend />
			</>
		),
	},
};

export const BarsHorizontal: Story = {
	args: {
		config: chartConfig,
		data: chartData,
		x: monthAxis,
		y: { keys: ["missions"] },
		orientation: "horizontal",
		className: frame,
		margin: { top: 4, right: 48, bottom: 4, left: 80 },
		children: (
			<>
				<Chart.Grid horizontal={false} vertical />
				<Chart.YAxis />
				<Chart.Cursor />
				<Chart.Bars />
				<Chart.LabelList marks="bars" />
				<Chart.Tooltip />
			</>
		),
	},
};

const walletFlow = [
	{ month: "January", net: 420 },
	{ month: "February", net: -180 },
	{ month: "March", net: 260 },
	{ month: "April", net: -90 },
	{ month: "May", net: 540 },
	{ month: "June", net: 310 },
];

export const BarsNegative: Story = {
	args: {
		config: { net: { label: "Net wallet flow" } },
		data: walletFlow,
		x: monthAxis,
		y: { keys: ["net"] },
		className: frame,
		children: (
			<>
				<Chart.Grid />
				<Chart.XAxis tickFormatter={(value) => `${value}`.slice(0, 3)} />
				<Chart.YAxis />
				<Chart.ReferenceLine value={0} label="" />
				<Chart.Bars
					fill={(datum) =>
						Number(datum.net) >= 0 ? "var(--chart-2)" : "var(--chart-5)"
					}
				/>
				<Chart.Tooltip />
			</>
		),
	},
};

export const Line: Story = {
	args: {
		config: chartConfig,
		data: chartData,
		x: { key: "month", type: "point" },
		y: bothSeries,
		className: frame,
		margin: { top: 8, right: 16, bottom: 52, left: 40 },
		children: (
			<>
				<Chart.Grid />
				<Chart.XAxis tickFormatter={(value) => `${value}`.slice(0, 3)} />
				<Chart.YAxis />
				<Chart.Cursor variant="line" />
				<Chart.Line />
				<Chart.Tooltip />
				<Chart.Legend />
			</>
		),
	},
};

export const LineStepWithDots: Story = {
	args: {
		config: chartConfig,
		data: chartData,
		x: { key: "month", type: "point" },
		y: { keys: ["bookings"] },
		className: frame,
		margin: { top: 8, right: 16, bottom: 24, left: 40 },
		children: (
			<>
				<Chart.Grid />
				<Chart.XAxis tickFormatter={(value) => `${value}`.slice(0, 3)} />
				<Chart.YAxis />
				<Chart.Line curve="step" dots />
				<Chart.LabelList />
				<Chart.Tooltip />
			</>
		),
	},
};

export const Area: Story = {
	args: {
		config: chartConfig,
		data: chartData,
		x: { key: "month", type: "point" },
		y: { keys: ["missions"] },
		className: frame,
		margin: { top: 8, right: 16, bottom: 24, left: 40 },
		children: (
			<>
				<Chart.Grid />
				<Chart.XAxis tickFormatter={(value) => `${value}`.slice(0, 3)} />
				<Chart.YAxis />
				<Chart.Cursor variant="line" />
				<Chart.Area />
				<Chart.Tooltip />
			</>
		),
	},
};

export const AreaStacked: Story = {
	args: {
		config: chartConfig,
		data: chartData,
		x: { key: "month", type: "point" },
		y: { keys: ["bookings", "missions"], stacked: true },
		className: frame,
		margin: { top: 8, right: 16, bottom: 52, left: 40 },
		children: (
			<>
				<Chart.Grid />
				<Chart.XAxis tickFormatter={(value) => `${value}`.slice(0, 3)} />
				<Chart.YAxis />
				<Chart.Area gradient={false} />
				<Chart.Tooltip />
				<Chart.Legend />
			</>
		),
	},
};

const scatterData = [
	{ club: "Alpha", missions: 12, providers: 8, spend: 4200 },
	{ club: "Bravo", missions: 26, providers: 15, spend: 9100 },
	{ club: "Charlie", missions: 18, providers: 11, spend: 6400 },
	{ club: "Delta", missions: 34, providers: 21, spend: 15800 },
	{ club: "Echo", missions: 9, providers: 5, spend: 2100 },
];

export const Points: Story = {
	args: {
		config: {
			missions: { label: "Missions", color: "var(--chart-4)" },
		},
		data: scatterData,
		x: { key: "club", type: "point" },
		y: { keys: ["missions"] },
		className: frame,
		margin: { top: 16, right: 24, bottom: 24, left: 40 },
		children: (
			<>
				<Chart.Grid vertical />
				<Chart.XAxis />
				<Chart.YAxis />
				<Chart.Points sizeKey="spend" />
				<Chart.Tooltip />
			</>
		),
	},
};

const specialtyData = [
	{ specialty: "physiotherapy", providers: 86 },
	{ specialty: "osteopathy", providers: 54 },
	{ specialty: "nursing", providers: 37 },
	{ specialty: "medicine", providers: 21 },
	{ specialty: "other", providers: 12 },
];

const specialtyConfig = {
	providers: { label: "Providers" },
	physiotherapy: { label: "Physiotherapy", color: "var(--chart-1)" },
	osteopathy: { label: "Osteopathy", color: "var(--chart-2)" },
	nursing: { label: "Nursing", color: "var(--chart-3)" },
	medicine: { label: "Medicine", color: "var(--chart-4)" },
	other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig;

const roundArgs = {
	config: specialtyConfig,
	data: specialtyData,
	x: { key: "specialty" },
	y: { keys: ["providers"] },
	className: square,
	margin: { top: 0, right: 0, bottom: 48, left: 0 },
	interactive: false,
} as const;

export const Pie: Story = {
	args: {
		...roundArgs,
		children: (
			<>
				<Chart.Pie />
				<Chart.Tooltip
					content={<Chart.TooltipContent nameKey="specialty" hideLabel />}
				/>
				<Chart.Legend content={<Chart.LegendContent nameKey="specialty" />} />
			</>
		),
	},
	play: async ({ canvasElement }) => {
		const wedges = canvasElement.querySelectorAll('[data-slot="chart-slice"]');
		await expect(wedges).toHaveLength(specialtyData.length);
		fireEvent.pointerOver(wedges[0]);
		// The readout portals to the document body, outside the story canvas.
		await expect(
			await within(document.body).findByRole("status"),
		).toHaveTextContent("Physiotherapy");
	},
};

export const Donut: Story = {
	args: {
		...roundArgs,
		children: (
			<>
				<Chart.Donut />
				<Chart.Tooltip
					content={<Chart.TooltipContent nameKey="specialty" hideLabel />}
				/>
				<Chart.Legend content={<Chart.LegendContent nameKey="specialty" />} />
			</>
		),
	},
};

const coverageData = [
	{ region: "Île-de-France", coverage: 92 },
	{ region: "Bretagne", coverage: 68 },
	{ region: "Occitanie", coverage: 74 },
	{ region: "Auvergne-Rhône-Alpes", coverage: 85 },
	{ region: "Nouvelle-Aquitaine", coverage: 61 },
	{ region: "Hauts-de-France", coverage: 57 },
];

export const Radar: Story = {
	args: {
		config: { coverage: { label: "Coverage", color: "var(--chart-1)" } },
		data: coverageData,
		x: { key: "region" },
		y: { keys: ["coverage"], domain: [0, 100] },
		className: "mx-auto aspect-square w-full max-w-96",
		margin: { top: 0, right: 0, bottom: 0, left: 0 },
		interactive: false,
		children: (
			<>
				<Chart.PolarGrid inset={radarInset} />
				<Chart.PolarAngleAxis inset={radarInset} />
				<Chart.Radar dots inset={radarInset} />
			</>
		),
	},
};

export const RadialBar: Story = {
	args: {
		config: {
			fillRate: { label: "Fill rate", color: "var(--chart-2)" },
			responseRate: { label: "Response rate", color: "var(--chart-1)" },
			repeatRate: { label: "Repeat rate", color: "var(--chart-4)" },
		},
		data: [
			{ metric: "fillRate", value: 78 },
			{ metric: "responseRate", value: 64 },
			{ metric: "repeatRate", value: 41 },
		],
		x: { key: "metric" },
		y: { keys: ["value"], domain: [0, 100] },
		className: square,
		margin: { top: 0, right: 0, bottom: 48, left: 0 },
		interactive: false,
		children: (
			<>
				<Chart.RadialBar />
				<Chart.Tooltip
					content={<Chart.TooltipContent nameKey="metric" hideLabel />}
				/>
				<Chart.Legend content={<Chart.LegendContent nameKey="metric" />} />
			</>
		),
	},
};

export const TooltipIndicators: Story = {
	args: {
		config: chartConfig,
		data: chartData,
		x: monthAxis,
		y: bothSeries,
		className: frame,
		children: (
			<>
				<Chart.Grid />
				<Chart.XAxis tickFormatter={(value) => `${value}`.slice(0, 3)} />
				<Chart.YAxis />
				<Chart.Cursor />
				<Chart.Bars />
				<Chart.Tooltip content={<Chart.TooltipContent indicator="dashed" />} />
			</>
		),
	},
};

export const LegendOnTop: Story = {
	args: {
		config: chartConfig,
		data: chartData,
		x: monthAxis,
		y: bothSeries,
		className: frame,
		margin: { top: 28, right: 8, bottom: 24, left: 40 },
		children: (
			<>
				<Chart.Grid />
				<Chart.XAxis tickFormatter={(value) => `${value}`.slice(0, 3)} />
				<Chart.YAxis />
				<Chart.Bars />
				<Chart.Legend align="top" />
			</>
		),
	},
};

export const Dark: Story = {
	...Bars,
	globals: { theme: "dark" },
};

export const Mobile: Story = {
	...Bars,
	globals: { viewport: { value: "mobile1", isRotated: false } },
};

export const Loading: StoryObj = {
	render: () => <Chart.Skeleton className={frame} />,
};

export const Empty: StoryObj = {
	render: () => (
		<Chart.Empty className={frame}>No data for this period</Chart.Empty>
	),
};

/** Several marks on one canvas, the way a real dashboard tile looks. */
export const Dashboard: StoryObj = {
	render: () => (
		<div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
			<Chart.Root
				config={chartConfig}
				data={chartData}
				x={monthAxis}
				y={bothSeries}
				className="aspect-auto w-full"
				style={{ height: 220 }}
			>
				<Chart.Grid />
				<Chart.XAxis tickFormatter={(value) => `${value}`.slice(0, 3)} />
				<Chart.YAxis />
				<Chart.Cursor />
				<Chart.Bars />
				<Chart.Tooltip />
			</Chart.Root>
			<Chart.Root
				config={chartConfig}
				data={chartData}
				x={{ key: "month", type: "point" }}
				y={{ keys: ["missions"] }}
				className="aspect-auto w-full"
				margin={{ top: 8, right: 16, bottom: 24, left: 40 }}
				style={{ height: 220 }}
			>
				<Chart.Grid />
				<Chart.XAxis tickFormatter={(value) => `${value}`.slice(0, 3)} />
				<Chart.YAxis />
				<Chart.Cursor variant="line" />
				<Chart.Area />
				<Chart.Tooltip />
			</Chart.Root>
			<Chart.Root {...roundArgs} className="aspect-square w-full">
				<Chart.Donut />
				<Chart.Tooltip
					content={<Chart.TooltipContent nameKey="specialty" hideLabel />}
				/>
				<Chart.Legend content={<Chart.LegendContent nameKey="specialty" />} />
			</Chart.Root>
			<Chart.Root
				config={chartConfig}
				data={chartData}
				x={monthAxis}
				y={{ keys: ["missions"] }}
				orientation="horizontal"
				className="aspect-auto w-full"
				margin={{ top: 4, right: 48, bottom: 4, left: 80 }}
				style={{ height: 220 }}
			>
				<Chart.Grid horizontal={false} vertical />
				<Chart.YAxis />
				<Chart.Bars />
				<Chart.LabelList marks="bars" />
				<Chart.Tooltip />
			</Chart.Root>
		</div>
	),
};
