import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Rating } from "@voila.dev/ui/rating";
import { useState } from "react";

const meta = {
	title: "UI/Rating",
	component: Rating.Root,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "default", "lg"],
		},
	},
	args: {
		value: 4,
		size: "default",
	},
} satisfies Meta<typeof Rating.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCount: Story = {
	args: {
		count: 128,
	},
};

export const FractionalValue: Story = {
	args: {
		value: 3.6,
	},
};

export const Sizes: Story = {
	render: (args) => (
		<div className="flex flex-col items-start gap-4">
			<Rating.Root {...args} size="sm" count={12} />
			<Rating.Root {...args} size="default" count={12} />
			<Rating.Root {...args} size="lg" count={12} />
		</div>
	),
};

function ControlledRatingInput() {
	const [value, setValue] = useState(3);
	return <Rating.Input value={value} onChange={setValue} />;
}

export const Input: Story = {
	render: () => <ControlledRatingInput />,
};

export const InputDisabled: Story = {
	render: () => <Rating.Input value={4} onChange={() => {}} disabled />,
};

export const Review: Story = {
	render: () => (
		<div className="flex max-w-md flex-col gap-6">
			<Rating.ReviewItem
				authorName="Camille Dubois"
				authorAvatarSrc="https://github.com/shadcn.png"
				rating={5}
				date="June 12, 2026"
			>
				Flawless work from kickoff to delivery — the whole redesign shipped
				ahead of schedule.
			</Rating.ReviewItem>
			<Rating.ReviewItem
				authorName="Nathan Guyot"
				rating={4}
				date="May 3, 2026"
			>
				Very professional and responsive.
			</Rating.ReviewItem>
		</div>
	),
};
