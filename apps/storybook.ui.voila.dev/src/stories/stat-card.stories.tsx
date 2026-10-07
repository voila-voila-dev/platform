import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	areaY,
	barY,
	type ChartMark,
	defineChart,
	lineY,
} from "@voila.dev/chart";
import { Chart, ChartEmpty, ChartSkeleton } from "@voila.dev/chart/react";
import { Button } from "@voila.dev/ui/button";
import { StatCard } from "@voila.dev/ui/stat-card";
import { useState } from "react";

const sparklineData = [
	{ month: "January", projects: 24, cancellations: 31 },
	{ month: "February", projects: 31, cancellations: 27 },
	{ month: "March", projects: 28, cancellations: 24 },
	{ month: "April", projects: 35, cancellations: 22 },
	{ month: "May", projects: 42, cancellations: 19 },
	{ month: "June", projects: 38, cancellations: 17 },
];

const sparklineSeries = {
	projects: { label: "Projects published", color: "var(--chart-1)" },
	cancellations: { label: "Cancellations", color: "var(--chart-2)" },
} as const;

type SparklineKey = keyof typeof sparklineSeries;
type SparklineMark = "area" | "line" | "bars";

const sparklineMarks: Record<SparklineMark, (key: SparklineKey) => ChartMark> =
	{
		area: (key) =>
			areaY(sparklineData, {
				x: "month",
				y: key,
				label: sparklineSeries[key].label,
				fill: sparklineSeries[key].color,
				line: true,
			}),
		line: (key) =>
			lineY(sparklineData, {
				x: "month",
				y: key,
				label: sparklineSeries[key].label,
				stroke: sparklineSeries[key].color,
			}),
		bars: (key) =>
			barY(sparklineData, {
				x: "month",
				y: key,
				label: sparklineSeries[key].label,
				fill: sparklineSeries[key].color,
				radius: 2,
			}),
	};

/**
 * A chart with no axes and no chrome: the shape is the whole message, so the
 * margins collapse to nothing and the card's own padding does the framing.
 */
function Sparkline({
	seriesKey = "projects",
	mark = "area",
	interactive = false,
}: {
	readonly seriesKey?: SparklineKey;
	readonly mark?: SparklineMark;
	readonly interactive?: boolean;
}) {
	return (
		<Chart
			ariaLabel={sparklineSeries[seriesKey].label}
			height={64}
			legend={false}
			tooltip={interactive}
			definition={defineChart({
				x: { axis: false },
				y: { axis: false, grid: false },
				margin: { top: 4, right: 0, bottom: 0, left: 0 },
				marks: [sparklineMarks[mark](seriesKey)],
			})}
		/>
	);
}

const meta = {
	title: "UI/StatCard",
	component: StatCard.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof StatCard.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		className: "w-64",
		children: (
			<>
				<StatCard.Header>
					<StatCard.Label>Projects published</StatCard.Label>
					<StatCard.Delta trend="up">+12%</StatCard.Delta>
				</StatCard.Header>
				<StatCard.Value>1,284</StatCard.Value>
			</>
		),
	},
};

export const WithSparkline: Story = {
	args: {
		className: "w-64",
		children: (
			<>
				<StatCard.Header>
					<StatCard.Label>Projects published</StatCard.Label>
					<StatCard.Delta trend="up">+12%</StatCard.Delta>
				</StatCard.Header>
				<StatCard.Value>1,284</StatCard.Value>
				<StatCard.Chart>
					<Sparkline />
				</StatCard.Chart>
			</>
		),
	},
};

export const Dashboard: Story = {
	render: () => (
		<div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>Projects published</StatCard.Label>
					<StatCard.Delta trend="up">+12%</StatCard.Delta>
				</StatCard.Header>
				<StatCard.Value>1,284</StatCard.Value>
				<StatCard.Chart>
					<Sparkline />
				</StatCard.Chart>
			</StatCard.Root>
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>Cancellations</StatCard.Label>
					{/* Down is the good direction here: invert via className. */}
					<StatCard.Delta trend="down" className="text-success">
						-3%
					</StatCard.Delta>
				</StatCard.Header>
				<StatCard.Value>17</StatCard.Value>
				<StatCard.Chart>
					<Sparkline />
				</StatCard.Chart>
			</StatCard.Root>
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>Fill rate</StatCard.Label>
					<StatCard.Delta>0%</StatCard.Delta>
				</StatCard.Header>
				<StatCard.Value>92%</StatCard.Value>
				<StatCard.Chart>
					<Sparkline />
				</StatCard.Chart>
			</StatCard.Root>
		</div>
	),
};

export const Loading: Story = {
	render: () => (
		<StatCard.Root className="w-64">
			<StatCard.Header>
				<StatCard.Label>Projects published</StatCard.Label>
			</StatCard.Header>
			<StatCard.Value>—</StatCard.Value>
			<StatCard.Chart className="px-4">
				<ChartSkeleton style={{ height: 64 }} />
			</StatCard.Chart>
		</StatCard.Root>
	),
};

export const Empty: Story = {
	render: () => (
		<StatCard.Root className="w-64">
			<StatCard.Header>
				<StatCard.Label>Projects published</StatCard.Label>
			</StatCard.Header>
			<StatCard.Value>0</StatCard.Value>
			<StatCard.Chart className="px-4 pb-4">
				<ChartEmpty style={{ height: 64 }}>No data yet</ChartEmpty>
			</StatCard.Chart>
		</StatCard.Root>
	),
};

/** The three sparkline shapes, side by side, so the choice is easy to make. */
export const SparklineShapes: Story = {
	render: () => (
		<div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
			{(["area", "line", "bars"] as const).map((mark) => (
				<StatCard.Root key={mark}>
					<StatCard.Header>
						<StatCard.Label>Projects published</StatCard.Label>
						<StatCard.Delta trend="up">+12%</StatCard.Delta>
					</StatCard.Header>
					<StatCard.Value>1,284</StatCard.Value>
					<StatCard.Chart>
						<Sparkline mark={mark} />
					</StatCard.Chart>
				</StatCard.Root>
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
		<StatCard.Root className="w-64">
			<StatCard.Header>
				<StatCard.Label>Projects published</StatCard.Label>
				<StatCard.Delta trend="up">+12%</StatCard.Delta>
			</StatCard.Header>
			<StatCard.Value>1,284</StatCard.Value>
			<StatCard.Chart>
				<Sparkline interactive />
			</StatCard.Chart>
		</StatCard.Root>
	),
};

/** Down is the good direction here, so the delta is recoloured by hand. */
export const FallingMetric: Story = {
	render: () => (
		<StatCard.Root className="w-64">
			<StatCard.Header>
				<StatCard.Label>Cancellations</StatCard.Label>
				<StatCard.Delta trend="down" className="text-success">
					-45%
				</StatCard.Delta>
			</StatCard.Header>
			<StatCard.Value>17</StatCard.Value>
			<StatCard.Chart>
				<Sparkline seriesKey="cancellations" mark="line" />
			</StatCard.Chart>
		</StatCard.Root>
	),
};

/**
 * `status` tints the frame, not the value: the number stays readable and a
 * scan of the grid shows where the fires are. `StatCard.Target` puts the
 * objective under the value so the tint has a stated reference.
 */
export const MetricStatus: Story = {
	render: () => (
		<div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
			<StatCard.Root status="on-track">
				<StatCard.Header>
					<StatCard.Label>Fill rate</StatCard.Label>
					<StatCard.Delta trend="up">+4%</StatCard.Delta>
				</StatCard.Header>
				<StatCard.Value>92%</StatCard.Value>
				<StatCard.Target>Target: 90%</StatCard.Target>
			</StatCard.Root>
			<StatCard.Root status="below-objective">
				<StatCard.Header>
					<StatCard.Label>Bookings confirmed</StatCard.Label>
					<StatCard.Delta trend="down">-8%</StatCard.Delta>
				</StatCard.Header>
				<StatCard.Value>1,102</StatCard.Value>
				<StatCard.Target>Target: 1,250</StatCard.Target>
			</StatCard.Root>
			<StatCard.Root status="alerting">
				<StatCard.Header>
					<StatCard.Label>Cancellations</StatCard.Label>
					{/* Up is the bad direction here: invert via className. */}
					<StatCard.Delta trend="up" className="text-destructive">
						+45%
					</StatCard.Delta>
				</StatCard.Header>
				<StatCard.Value>17</StatCard.Value>
				<StatCard.Target>Target: under 10</StatCard.Target>
			</StatCard.Root>
		</div>
	),
};

/** The status grid on a phone: the tiles stack, the tints still scan. */
export const MetricStatusMobile: Story = {
	...MetricStatus,
	globals: { viewport: { value: "mobile1", isRotated: false } },
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
				<StatCard.Root key={tile.label} size="sm">
					<StatCard.Header>
						<StatCard.Label>{tile.label}</StatCard.Label>
					</StatCard.Header>
					<StatCard.Value>{tile.value}</StatCard.Value>
					<StatCard.Chart>
						<Sparkline mark={tile.mark as "area" | "line" | "bars"} />
					</StatCard.Chart>
				</StatCard.Root>
			))}
		</div>
	),
};

/** A full KPI strip: what these cards actually look like on an admin page. */
export const KpiStrip: Story = {
	render: () => (
		<div className="grid w-full max-w-5xl grid-cols-2 gap-4 lg:grid-cols-3">
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>Projects published</StatCard.Label>
					<StatCard.Delta trend="up">+12%</StatCard.Delta>
				</StatCard.Header>
				<StatCard.Value>1,284</StatCard.Value>
				<StatCard.Chart>
					<Sparkline interactive />
				</StatCard.Chart>
			</StatCard.Root>
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>Cancellations</StatCard.Label>
					<StatCard.Delta trend="down" className="text-success">
						-45%
					</StatCard.Delta>
				</StatCard.Header>
				<StatCard.Value>17</StatCard.Value>
				<StatCard.Chart>
					<Sparkline seriesKey="cancellations" mark="line" interactive />
				</StatCard.Chart>
			</StatCard.Root>
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>Bookings confirmed</StatCard.Label>
					<StatCard.Delta>0%</StatCard.Delta>
				</StatCard.Header>
				<StatCard.Value>1,102</StatCard.Value>
				<StatCard.Chart>
					<Sparkline mark="bars" interactive />
				</StatCard.Chart>
			</StatCard.Root>
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>Awaiting data</StatCard.Label>
				</StatCard.Header>
				<StatCard.Value>—</StatCard.Value>
				<StatCard.Chart className="px-4">
					<ChartSkeleton style={{ height: 64 }} />
				</StatCard.Chart>
			</StatCard.Root>
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>New this week</StatCard.Label>
				</StatCard.Header>
				<StatCard.Value>0</StatCard.Value>
				<StatCard.Chart className="px-4 pb-4">
					<ChartEmpty style={{ height: 64 }}>No data yet</ChartEmpty>
				</StatCard.Chart>
			</StatCard.Root>
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>Fill rate</StatCard.Label>
					<StatCard.Delta trend="up">+4%</StatCard.Delta>
				</StatCard.Header>
				<StatCard.Value>92%</StatCard.Value>
				<StatCard.Chart>
					<Sparkline mark="area" />
				</StatCard.Chart>
			</StatCard.Root>
		</div>
	),
};

/** The same strip in the dark theme, which the colours are tokenized for. */
export const KpiStripDark: Story = {
	...KpiStrip,
	globals: { theme: "dark" },
};

/**
 * `value` instead of children: the number springs to its new value when the
 * data refreshes. Screen readers hear the final value only; reduced motion
 * jumps.
 */
export const AnimatedValue: Story = {
	render: function AnimatedValueStory() {
		const [index, setIndex] = useState(0);
		const counts = [1284, 1342, 1297];
		return (
			<div className="grid justify-items-center gap-3">
				<StatCard.Root className="w-64">
					<StatCard.Header>
						<StatCard.Label>Projects published</StatCard.Label>
					</StatCard.Header>
					<StatCard.Value
						value={counts[index] ?? 0}
						format={new Intl.NumberFormat("fr-FR")}
					/>
				</StatCard.Root>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setIndex((index + 1) % counts.length)}
				>
					Rafraîchir
				</Button>
			</div>
		);
	},
};
