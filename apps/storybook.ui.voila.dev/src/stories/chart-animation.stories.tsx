import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Bounce,
	DrawIn,
	HeatmapColours,
	MorphingMap,
	PieSlices,
	SlidingWindow,
	Stagger,
} from "./chart-animation-examples";

const meta = {
	title: "Chart/Animation",
	parameters: { layout: "padded" },
	decorators: [
		(Story) => (
			<div className="w-full max-w-xl">
				<Story />
			</div>
		),
	],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** Points keyed by x slide when the window moves; a new month enters from the last one. */
export const SlidingTimeWindow: Story = { render: () => <SlidingWindow /> };

/** Slices open from where they will sit and close onto their neighbour. */
export const PieSliceAddedAndRemoved: Story = { render: () => <PieSlices /> };

/** `animate={{ duration: 500, bounce: 0.35 }}`: bounce is opt-in. */
export const SpringBounce: Story = { render: () => <Bounce /> };

/** `animate={{ stagger: 50 }}`: in focus order, capped at 300 ms in all. */
export const StaggeredBars: Story = { render: () => <Stagger /> };

/** `enter: "draw"`: the line traces itself in on the first render. */
export const LineDrawIn: Story = { render: () => <DrawIn /> };

/** Outlines with no simpler meaning morph: here four zones go from square to round. */
export const MorphingZones: Story = { render: () => <MorphingMap /> };

/** Fills tint through `color-mix(in oklab, …)`. */
export const HeatmapColourChange: Story = { render: () => <HeatmapColours /> };
