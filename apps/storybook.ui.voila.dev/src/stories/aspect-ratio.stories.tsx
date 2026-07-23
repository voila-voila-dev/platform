import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { AspectRatio } from "@voila.dev/ui/components/aspect-ratio";

const meta = {
	title: "UI/AspectRatio",
	component: AspectRatio,
	tags: ["autodocs"],
} satisfies Meta<typeof AspectRatio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		ratio: 16 / 9,
	},
	render: (args) => (
		<div className="w-96">
			<AspectRatio {...args}>
				<img
					src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80"
					alt="Athlete lifting a barbell during a workout"
					className="size-full rounded-lg object-cover"
				/>
			</AspectRatio>
		</div>
	),
};

export const Square: Story = {
	args: {
		ratio: 1,
	},
	render: (args) => (
		<div className="w-48">
			<AspectRatio {...args}>
				<img
					src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80"
					alt="Athlete lifting a barbell during a workout"
					className="size-full rounded-lg object-cover"
				/>
			</AspectRatio>
		</div>
	),
};

export const Portrait: Story = {
	args: {
		ratio: "3/4",
	},
	render: (args) => (
		<div className="w-48">
			<AspectRatio {...args}>
				<img
					src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80"
					alt="Athlete lifting a barbell during a workout"
					className="size-full rounded-lg object-cover"
				/>
			</AspectRatio>
		</div>
	),
};

export const MapEmbed: Story = {
	args: {
		ratio: 16 / 9,
	},
	render: (args) => (
		<div className="w-96">
			<AspectRatio {...args}>
				<iframe
					src="https://www.openstreetmap.org/export/embed.html?bbox=2.2241%2C48.8156%2C2.4699%2C48.9021&layer=mapnik"
					title="Map of Paris"
					className="size-full rounded-lg border-0"
				/>
			</AspectRatio>
		</div>
	),
};
