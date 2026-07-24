import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Rating,
	RatingInput,
	ReviewItem,
} from "@voila.dev/ui/components/rating";
import { useState } from "react";

const meta = {
	title: "UI/Rating",
	component: Rating,
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
} satisfies Meta<typeof Rating>;

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
			<Rating {...args} size="sm" count={12} />
			<Rating {...args} size="default" count={12} />
			<Rating {...args} size="lg" count={12} />
		</div>
	),
};

function ControlledRatingInput() {
	const [value, setValue] = useState(3);
	return <RatingInput value={value} onChange={setValue} />;
}

export const Input: Story = {
	render: () => <ControlledRatingInput />,
};

export const InputDisabled: Story = {
	render: () => <RatingInput value={4} onChange={() => {}} disabled />,
};

export const Review: Story = {
	render: () => (
		<div className="flex max-w-md flex-col gap-6">
			<ReviewItem
				authorName="Camille Dubois"
				authorAvatarSrc="https://github.com/shadcn.png"
				rating={5}
				date="June 12, 2026"
			>
				Flawless work from kickoff to delivery — the whole redesign shipped
				ahead of schedule.
			</ReviewItem>
			<ReviewItem authorName="Nathan Guyot" rating={4} date="May 3, 2026">
				Very professional and responsive.
			</ReviewItem>
		</div>
	),
};
