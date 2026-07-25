import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Heading,
	headingAlignOptions,
	headingLevelOptions,
} from "@voila.dev/ui/landing/heading";

const meta = {
	title: "Landing/Heading",
	component: Heading,
	tags: ["autodocs"],
	args: {
		children: "Two journeys, one meeting point",
	},
	argTypes: {
		level: {
			control: "select",
			options: headingLevelOptions,
		},
		align: {
			control: "select",
			options: headingAlignOptions,
		},
	},
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Levels: Story = {
	render: () => (
		<div className="space-y-4">
			{headingLevelOptions.map((level) => (
				<Heading key={level} level={level}>
					Heading {level}
				</Heading>
			))}
		</div>
	),
};

export const WithHighlights: Story = {
	render: () => (
		<Heading level="h1">
			Find a <span className="text-brand">trusted freelancer</span> for your{" "}
			<span className="text-highlight">next projects</span>
		</Heading>
	),
};
