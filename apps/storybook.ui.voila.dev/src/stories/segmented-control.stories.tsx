import {
	ListIcon,
	MapTrifoldIcon,
	SquaresFourIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { SegmentedControl } from "@voila.dev/ui/segmented-control";

const meta = {
	title: "UI/SegmentedControl",
	component: SegmentedControl.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof SegmentedControl.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<SegmentedControl.Root defaultValue="week">
			<SegmentedControl.Item value="day">Day</SegmentedControl.Item>
			<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
			<SegmentedControl.Item value="month">Month</SegmentedControl.Item>
		</SegmentedControl.Root>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col items-start gap-4">
			<SegmentedControl.Root defaultValue="week" size="sm">
				<SegmentedControl.Item value="day">Day</SegmentedControl.Item>
				<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
				<SegmentedControl.Item value="month">Month</SegmentedControl.Item>
			</SegmentedControl.Root>
			<SegmentedControl.Root defaultValue="week">
				<SegmentedControl.Item value="day">Day</SegmentedControl.Item>
				<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
				<SegmentedControl.Item value="month">Month</SegmentedControl.Item>
			</SegmentedControl.Root>
			<SegmentedControl.Root defaultValue="week" size="lg">
				<SegmentedControl.Item value="day">Day</SegmentedControl.Item>
				<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
				<SegmentedControl.Item value="month">Month</SegmentedControl.Item>
			</SegmentedControl.Root>
		</div>
	),
};

export const WithIcons: Story = {
	render: () => (
		<SegmentedControl.Root defaultValue="list">
			<SegmentedControl.Item value="list">
				<ListIcon />
				List
			</SegmentedControl.Item>
			<SegmentedControl.Item value="grid">
				<SquaresFourIcon />
				Grid
			</SegmentedControl.Item>
			<SegmentedControl.Item value="map">
				<MapTrifoldIcon />
				Map
			</SegmentedControl.Item>
		</SegmentedControl.Root>
	),
};

export const IconOnly: Story = {
	render: () => (
		<SegmentedControl.Root defaultValue="list">
			<SegmentedControl.Item value="list" aria-label="List view">
				<ListIcon />
			</SegmentedControl.Item>
			<SegmentedControl.Item value="grid" aria-label="Grid view">
				<SquaresFourIcon />
			</SegmentedControl.Item>
			<SegmentedControl.Item value="map" aria-label="Map view">
				<MapTrifoldIcon />
			</SegmentedControl.Item>
		</SegmentedControl.Root>
	),
};

export const WithDisabledItem: Story = {
	render: () => (
		<SegmentedControl.Root defaultValue="week">
			<SegmentedControl.Item value="day">Day</SegmentedControl.Item>
			<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
			<SegmentedControl.Item value="month" disabled>
				Month
			</SegmentedControl.Item>
		</SegmentedControl.Root>
	),
};

export const Stretch: Story = {
	render: () => (
		<SegmentedControl.Root defaultValue="week" stretch>
			<SegmentedControl.Item value="day">Day</SegmentedControl.Item>
			<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
			<SegmentedControl.Item value="month">Month</SegmentedControl.Item>
		</SegmentedControl.Root>
	),
};
