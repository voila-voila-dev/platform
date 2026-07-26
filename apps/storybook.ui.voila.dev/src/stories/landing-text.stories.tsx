import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Text,
	textAlignOptions,
	textSizeOptions,
	textVariantOptions,
	textWeightOptions,
} from "@voila.dev/ui/landing";

const meta = {
	title: "Landing/Text",
	component: Text,
	tags: ["autodocs"],
	args: {
		children:
			"The platform that connects client teams with independent freelancers to scope, staff and deliver projects wherever the work happens.",
	},
	argTypes: {
		variant: {
			control: "select",
			options: textVariantOptions,
		},
		size: {
			control: "select",
			options: textSizeOptions,
		},
		align: {
			control: "select",
			options: textAlignOptions,
		},
		weight: {
			control: "select",
			options: textWeightOptions,
		},
	},
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className="space-y-4">
			{textVariantOptions.map((variant) => (
				<Text key={variant} variant={variant}>
					{variant} — Let's build a fairer way of working together.
				</Text>
			))}
		</div>
	),
};
