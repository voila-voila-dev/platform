import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Progress } from "@voila.dev/ui/progress";
import { expect } from "storybook/test";

const meta = {
	title: "UI/Progress",
	component: Progress.Root,
	tags: ["autodocs"],
	args: {
		value: 60,
		className: "w-80",
	},
} satisfies Meta<typeof Progress.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const track = canvasElement.querySelector("[data-slot=progress-track]");
		const indicator = canvasElement.querySelector(
			"[data-slot=progress-indicator]",
		);
		const trackWidth = track?.getBoundingClientRect().width ?? 0;
		const indicatorWidth = indicator?.getBoundingClientRect().width ?? 0;
		// The indicator width must track the value (60% of the track).
		expect(trackWidth).toBeGreaterThan(0);
		expect(indicatorWidth / trackWidth).toBeCloseTo(0.6, 2);
	},
};

export const WithLabelAndValue: Story = {
	args: {
		value: 35,
	},
	render: (args) => (
		<Progress.Root {...args}>
			<Progress.Label>Profile completion</Progress.Label>
			<Progress.Value />
		</Progress.Root>
	),
};

export const Indeterminate: Story = {
	args: {
		value: null,
	},
	render: (args) => (
		<Progress.Root {...args}>
			<Progress.Label>Uploading…</Progress.Label>
		</Progress.Root>
	),
};

export const CustomFormat: Story = {
	args: {
		value: 1200,
		max: 2000,
	},
	render: (args) => (
		<Progress.Root {...args}>
			<Progress.Label>Storage used</Progress.Label>
			<Progress.Value>{(_, value) => `${value} / 2000 MB`}</Progress.Value>
		</Progress.Root>
	),
};

export const ThickTrack: Story = {
	args: {
		value: 60,
		trackClassName: "h-2",
	},
};

export const Complete: Story = {
	args: {
		value: 100,
	},
};
