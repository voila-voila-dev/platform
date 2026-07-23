import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Heading,
	headingAlignOptions,
	headingLevelOptions,
} from "@voila.dev/ui-landing/components/heading";

const meta = {
	title: "Landing/Heading",
	component: Heading,
	tags: ["autodocs"],
	args: {
		children: "Deux parcours, une rencontre",
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
			Trouvez un <span className="text-provider">pro de santé</span> pour vos{" "}
			<span className="text-organization">événements sportifs</span>
		</Heading>
	),
};
