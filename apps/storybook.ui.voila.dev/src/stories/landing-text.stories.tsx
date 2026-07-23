import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Text,
	textAlignOptions,
	textSizeOptions,
	textVariantOptions,
	textWeightOptions,
} from "@voila.dev/ui-landing/components/text";

const meta = {
	title: "Landing/Text",
	component: Text,
	tags: ["autodocs"],
	args: {
		children:
			"La plateforme qui met en relation clubs de sport et professionnels de santé pour l'accompagnement santé des sportifs en déplacement.",
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
					{variant} — Construisons ensemble un sport amateur plus sain.
				</Text>
			))}
		</div>
	),
};
