import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Slider } from "@voila.dev/ui/slider";
import { expect } from "storybook/test";

const meta = {
	title: "UI/Slider",
	component: Slider.Root,
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
	},
} satisfies Meta<typeof Slider.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function trackRectangle(canvasElement: HTMLElement): DOMRect {
	const track = canvasElement.querySelector("[data-slot=slider-track]");
	if (track === null) {
		throw new Error("Expected a [data-slot=slider-track] element");
	}
	return track.getBoundingClientRect();
}

export const Default: Story = {
	render: () => (
		<div className="w-72">
			<Slider.Root defaultValue={50} />
		</div>
	),
	play: async ({ canvasElement }) => {
		// The track collapsed to 0px height when the orientation variants
		// were dead - guard the regression.
		expect(trackRectangle(canvasElement).height).toBeGreaterThan(0);
		const thumbs = canvasElement.querySelectorAll("[data-slot=slider-thumb]");
		// A single-value slider renders a single thumb.
		expect(thumbs.length).toBe(1);
	},
};

export const Range: Story = {
	render: () => (
		<div className="w-72 space-y-2">
			<p className="text-sm font-medium">Hourly rate (USD)</p>
			<Slider.Root defaultValue={[35, 65]} min={20} max={100} />
		</div>
	),
};

export const WithValue: Story = {
	render: () => (
		<div className="w-72">
			<Slider.Root defaultValue={[35, 65]} min={20} max={100}>
				<div className="mt-2 flex justify-between">
					<span className="text-sm font-medium">Hourly rate (USD)</span>
					<Slider.Value />
				</div>
			</Slider.Root>
		</div>
	),
};

export const Steps: Story = {
	render: () => (
		<div className="w-72">
			<Slider.Root defaultValue={60} min={0} max={120} step={15}>
				<div className="mt-2 flex justify-between">
					<span className="text-sm font-medium">Meeting duration (min)</span>
					<Slider.Value />
				</div>
			</Slider.Root>
		</div>
	),
};

export const Vertical: Story = {
	render: () => (
		<div className="flex h-48 justify-center">
			<Slider.Root defaultValue={50} orientation="vertical" />
		</div>
	),
	play: async ({ canvasElement }) => {
		const rectangle = trackRectangle(canvasElement);
		// Vertical sliders must render a tall, thin track.
		expect(rectangle.width).toBeGreaterThan(0);
		expect(rectangle.height).toBeGreaterThan(rectangle.width);
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="w-72">
			<Slider.Root defaultValue={30} disabled />
		</div>
	),
};
