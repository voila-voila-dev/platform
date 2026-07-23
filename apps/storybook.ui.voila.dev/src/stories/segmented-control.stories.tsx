import {
	ListIcon,
	MapTrifoldIcon,
	SquaresFourIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	SegmentedControl,
	SegmentedControlItem,
} from "@voila.dev/ui/components/segmented-control";

const meta = {
	title: "UI/SegmentedControl",
	component: SegmentedControl,
	tags: ["autodocs"],
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<SegmentedControl defaultValue="week">
			<SegmentedControlItem value="day">Day</SegmentedControlItem>
			<SegmentedControlItem value="week">Week</SegmentedControlItem>
			<SegmentedControlItem value="month">Month</SegmentedControlItem>
		</SegmentedControl>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col items-start gap-4">
			<SegmentedControl defaultValue="week" size="sm">
				<SegmentedControlItem value="day">Day</SegmentedControlItem>
				<SegmentedControlItem value="week">Week</SegmentedControlItem>
				<SegmentedControlItem value="month">Month</SegmentedControlItem>
			</SegmentedControl>
			<SegmentedControl defaultValue="week">
				<SegmentedControlItem value="day">Day</SegmentedControlItem>
				<SegmentedControlItem value="week">Week</SegmentedControlItem>
				<SegmentedControlItem value="month">Month</SegmentedControlItem>
			</SegmentedControl>
			<SegmentedControl defaultValue="week" size="lg">
				<SegmentedControlItem value="day">Day</SegmentedControlItem>
				<SegmentedControlItem value="week">Week</SegmentedControlItem>
				<SegmentedControlItem value="month">Month</SegmentedControlItem>
			</SegmentedControl>
		</div>
	),
};

export const WithIcons: Story = {
	render: () => (
		<SegmentedControl defaultValue="list">
			<SegmentedControlItem value="list">
				<ListIcon />
				List
			</SegmentedControlItem>
			<SegmentedControlItem value="grid">
				<SquaresFourIcon />
				Grid
			</SegmentedControlItem>
			<SegmentedControlItem value="map">
				<MapTrifoldIcon />
				Map
			</SegmentedControlItem>
		</SegmentedControl>
	),
};

export const IconOnly: Story = {
	render: () => (
		<SegmentedControl defaultValue="list">
			<SegmentedControlItem value="list" aria-label="List view">
				<ListIcon />
			</SegmentedControlItem>
			<SegmentedControlItem value="grid" aria-label="Grid view">
				<SquaresFourIcon />
			</SegmentedControlItem>
			<SegmentedControlItem value="map" aria-label="Map view">
				<MapTrifoldIcon />
			</SegmentedControlItem>
		</SegmentedControl>
	),
};

export const WithDisabledItem: Story = {
	render: () => (
		<SegmentedControl defaultValue="week">
			<SegmentedControlItem value="day">Day</SegmentedControlItem>
			<SegmentedControlItem value="week">Week</SegmentedControlItem>
			<SegmentedControlItem value="month" disabled>
				Month
			</SegmentedControlItem>
		</SegmentedControl>
	),
};

export const FullWidth: Story = {
	render: () => (
		<SegmentedControl defaultValue="week" className="w-full *:flex-1">
			<SegmentedControlItem value="day">Day</SegmentedControlItem>
			<SegmentedControlItem value="week">Week</SegmentedControlItem>
			<SegmentedControlItem value="month">Month</SegmentedControlItem>
		</SegmentedControl>
	),
};
