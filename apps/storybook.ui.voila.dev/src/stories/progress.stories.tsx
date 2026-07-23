import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Progress,
	ProgressLabel,
	ProgressValue,
} from "@voila.dev/ui/components/progress";
import { expect } from "storybook/test";

const meta = {
	title: "UI/Progress",
	component: Progress,
	tags: ["autodocs"],
	args: {
		value: 60,
		className: "w-80",
	},
} satisfies Meta<typeof Progress>;

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
		<Progress {...args}>
			<ProgressLabel>Profile completion</ProgressLabel>
			<ProgressValue />
		</Progress>
	),
};

export const Indeterminate: Story = {
	args: {
		value: null,
	},
	render: (args) => (
		<Progress {...args}>
			<ProgressLabel>Uploading…</ProgressLabel>
		</Progress>
	),
};

export const CustomFormat: Story = {
	args: {
		value: 1200,
		max: 2000,
	},
	render: (args) => (
		<Progress {...args}>
			<ProgressLabel>Storage used</ProgressLabel>
			<ProgressValue>{(_, value) => `${value} / 2000 MB`}</ProgressValue>
		</Progress>
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
