import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	StatCard,
	StatCardChart,
	StatCardDelta,
	StatCardHeader,
	StatCardLabel,
	StatCardValue,
} from "@voila.dev/ui/components/stat-card";
import { Chart, type ChartConfig } from "@voila.dev/ui-chart/components/chart";
import type * as React from "react";

const sparklineData = [
	{ month: "January", missions: 24, cancellations: 31 },
	{ month: "February", missions: 31, cancellations: 27 },
	{ month: "March", missions: 28, cancellations: 24 },
	{ month: "April", missions: 35, cancellations: 22 },
	{ month: "May", missions: 42, cancellations: 19 },
	{ month: "June", missions: 38, cancellations: 17 },
];

const sparklineConfig = {
	missions: { label: "Missions published", color: "var(--chart-1)" },
	cancellations: { label: "Cancellations", color: "var(--chart-2)" },
} satisfies ChartConfig;

type SparklineKey = keyof typeof sparklineConfig;
type SparklineMark = "area" | "line" | "bars";

/** Bars need a slot to sit in; a line or an area wants the full width. */
const sparklineMarks = {
	area: { node: <Chart.Area />, axis: "point" },
	line: { node: <Chart.Line />, axis: "point" },
	bars: { node: <Chart.Bars radius={2} gap={3} />, axis: "band" },
} as const satisfies Record<
	SparklineMark,
	{ node: React.ReactNode; axis: "band" | "point" }
>;

/**
 * A chart with no axes and no chrome: the shape is the whole message, so the
 * margins collapse to nothing and the card's own padding does the framing.
 */
function Sparkline({
	seriesKey = "missions",
	mark = "area",
	interactive = false,
}: {
	readonly seriesKey?: SparklineKey;
	readonly mark?: SparklineMark;
	readonly interactive?: boolean;
}) {
	return (
		<Chart.Root
			config={sparklineConfig}
			data={sparklineData}
			x={{ key: "month", type: sparklineMarks[mark].axis }}
			y={{ keys: [seriesKey] }}
			className="aspect-auto h-16 w-full"
			margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
			interactive={interactive}
		>
			{interactive ? <Chart.Cursor /> : null}
			{sparklineMarks[mark].node}
			{interactive ? <Chart.Tooltip /> : null}
		</Chart.Root>
	);
}

const meta = {
	title: "UI/StatCard",
	component: StatCard,
	tags: ["autodocs"],
} satisfies Meta<typeof StatCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		className: "w-64",
		children: (
			<>
				<StatCardHeader>
					<StatCardLabel>Missions published</StatCardLabel>
					<StatCardDelta trend="up">+12%</StatCardDelta>
				</StatCardHeader>
				<StatCardValue>1,284</StatCardValue>
			</>
		),
	},
};

export const WithSparkline: Story = {
	args: {
		className: "w-64",
		children: (
			<>
				<StatCardHeader>
					<StatCardLabel>Missions published</StatCardLabel>
					<StatCardDelta trend="up">+12%</StatCardDelta>
				</StatCardHeader>
				<StatCardValue>1,284</StatCardValue>
				<StatCardChart>
					<Sparkline />
				</StatCardChart>
			</>
		),
	},
};

export const Dashboard: Story = {
	render: () => (
		<div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
			<StatCard>
				<StatCardHeader>
					<StatCardLabel>Missions published</StatCardLabel>
					<StatCardDelta trend="up">+12%</StatCardDelta>
				</StatCardHeader>
				<StatCardValue>1,284</StatCardValue>
				<StatCardChart>
					<Sparkline />
				</StatCardChart>
			</StatCard>
			<StatCard>
				<StatCardHeader>
					<StatCardLabel>Cancellations</StatCardLabel>
					{/* Down is the good direction here: invert via className. */}
					<StatCardDelta trend="down" className="text-success">
						-3%
					</StatCardDelta>
				</StatCardHeader>
				<StatCardValue>17</StatCardValue>
				<StatCardChart>
					<Sparkline />
				</StatCardChart>
			</StatCard>
			<StatCard>
				<StatCardHeader>
					<StatCardLabel>Fill rate</StatCardLabel>
					<StatCardDelta>0%</StatCardDelta>
				</StatCardHeader>
				<StatCardValue>92%</StatCardValue>
				<StatCardChart>
					<Sparkline />
				</StatCardChart>
			</StatCard>
		</div>
	),
};

export const Loading: Story = {
	render: () => (
		<StatCard className="w-64">
			<StatCardHeader>
				<StatCardLabel>Missions published</StatCardLabel>
			</StatCardHeader>
			<StatCardValue>—</StatCardValue>
			<StatCardChart className="px-4">
				<Chart.Skeleton className="h-16" />
			</StatCardChart>
		</StatCard>
	),
};

export const Empty: Story = {
	render: () => (
		<StatCard className="w-64">
			<StatCardHeader>
				<StatCardLabel>Missions published</StatCardLabel>
			</StatCardHeader>
			<StatCardValue>0</StatCardValue>
			<StatCardChart className="px-4 pb-4">
				<Chart.Empty className="h-16">No data yet</Chart.Empty>
			</StatCardChart>
		</StatCard>
	),
};

/** The three sparkline shapes, side by side, so the choice is easy to make. */
export const SparklineShapes: Story = {
	render: () => (
		<div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
			{(["area", "line", "bars"] as const).map((mark) => (
				<StatCard key={mark}>
					<StatCardHeader>
						<StatCardLabel>Missions published</StatCardLabel>
						<StatCardDelta trend="up">+12%</StatCardDelta>
					</StatCardHeader>
					<StatCardValue>1,284</StatCardValue>
					<StatCardChart>
						<Sparkline mark={mark} />
					</StatCardChart>
				</StatCard>
			))}
		</div>
	),
};

/**
 * A sparkline the reader can interrogate: the cursor and tooltip work in a
 * 64-pixel-tall chart exactly as they do in a full-size one.
 */
export const InteractiveSparkline: Story = {
	render: () => (
		<StatCard className="w-64">
			<StatCardHeader>
				<StatCardLabel>Missions published</StatCardLabel>
				<StatCardDelta trend="up">+12%</StatCardDelta>
			</StatCardHeader>
			<StatCardValue>1,284</StatCardValue>
			<StatCardChart>
				<Sparkline interactive />
			</StatCardChart>
		</StatCard>
	),
};

/** Down is the good direction here, so the delta is recoloured by hand. */
export const FallingMetric: Story = {
	render: () => (
		<StatCard className="w-64">
			<StatCardHeader>
				<StatCardLabel>Cancellations</StatCardLabel>
				<StatCardDelta trend="down" className="text-success">
					-45%
				</StatCardDelta>
			</StatCardHeader>
			<StatCardValue>17</StatCardValue>
			<StatCardChart>
				<Sparkline seriesKey="cancellations" mark="line" />
			</StatCardChart>
		</StatCard>
	),
};

/** The compact card: same anatomy, tighter padding, for dense dashboards. */
export const Compact: Story = {
	render: () => (
		<div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
			{[
				{ label: "Published", value: "1,284", mark: "area" },
				{ label: "Booked", value: "1,102", mark: "line" },
				{ label: "Cancelled", value: "17", mark: "bars" },
				{ label: "Fill rate", value: "92%", mark: "area" },
			].map((tile) => (
				<StatCard key={tile.label} size="sm">
					<StatCardHeader>
						<StatCardLabel>{tile.label}</StatCardLabel>
					</StatCardHeader>
					<StatCardValue>{tile.value}</StatCardValue>
					<StatCardChart>
						<Sparkline mark={tile.mark as "area" | "line" | "bars"} />
					</StatCardChart>
				</StatCard>
			))}
		</div>
	),
};

/** A full KPI strip: what these cards actually look like on an admin page. */
export const KpiStrip: Story = {
	render: () => (
		<div className="grid w-full max-w-5xl grid-cols-2 gap-4 lg:grid-cols-3">
			<StatCard>
				<StatCardHeader>
					<StatCardLabel>Missions published</StatCardLabel>
					<StatCardDelta trend="up">+12%</StatCardDelta>
				</StatCardHeader>
				<StatCardValue>1,284</StatCardValue>
				<StatCardChart>
					<Sparkline interactive />
				</StatCardChart>
			</StatCard>
			<StatCard>
				<StatCardHeader>
					<StatCardLabel>Cancellations</StatCardLabel>
					<StatCardDelta trend="down" className="text-success">
						-45%
					</StatCardDelta>
				</StatCardHeader>
				<StatCardValue>17</StatCardValue>
				<StatCardChart>
					<Sparkline seriesKey="cancellations" mark="line" interactive />
				</StatCardChart>
			</StatCard>
			<StatCard>
				<StatCardHeader>
					<StatCardLabel>Bookings confirmed</StatCardLabel>
					<StatCardDelta>0%</StatCardDelta>
				</StatCardHeader>
				<StatCardValue>1,102</StatCardValue>
				<StatCardChart>
					<Sparkline mark="bars" interactive />
				</StatCardChart>
			</StatCard>
			<StatCard>
				<StatCardHeader>
					<StatCardLabel>Awaiting data</StatCardLabel>
				</StatCardHeader>
				<StatCardValue>—</StatCardValue>
				<StatCardChart className="px-4">
					<Chart.Skeleton className="h-16" />
				</StatCardChart>
			</StatCard>
			<StatCard>
				<StatCardHeader>
					<StatCardLabel>New this week</StatCardLabel>
				</StatCardHeader>
				<StatCardValue>0</StatCardValue>
				<StatCardChart className="px-4 pb-4">
					<Chart.Empty className="h-16">No data yet</Chart.Empty>
				</StatCardChart>
			</StatCard>
			<StatCard>
				<StatCardHeader>
					<StatCardLabel>Fill rate</StatCardLabel>
					<StatCardDelta trend="up">+4%</StatCardDelta>
				</StatCardHeader>
				<StatCardValue>92%</StatCardValue>
				<StatCardChart>
					<Sparkline mark="area" />
				</StatCardChart>
			</StatCard>
		</div>
	),
};

/** The same strip in the dark theme, which the colours are tokenized for. */
export const KpiStripDark: Story = {
	...KpiStrip,
	globals: { theme: "dark" },
};
