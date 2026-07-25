import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Container } from "@voila.dev/ui/landing/container";
import { Heading } from "@voila.dev/ui/landing/heading";
import {
	Section,
	sectionBackgroundOptions,
	sectionSpacingOptions,
} from "@voila.dev/ui/landing/section";
import { Text } from "@voila.dev/ui/landing/text";

const meta = {
	title: "Landing/Section",
	component: Section,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		spacing: {
			control: "select",
			options: sectionSpacingOptions,
		},
		background: {
			control: "select",
			options: sectionBackgroundOptions,
		},
	},
	args: {
		spacing: "md",
		background: "default",
	},
	render: (args) => (
		<Section {...args}>
			<Container>
				<Heading>Une bande de section</Heading>
				<Text variant="muted">
					Le rythme vertical et le fond se pilotent par variantes.
				</Text>
			</Container>
		</Section>
	),
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Backgrounds: Story = {
	render: () => (
		<div>
			{sectionBackgroundOptions.map((background) => (
				<Section key={background} spacing="sm" background={background}>
					<Container>
						<Text weight="medium">{background}</Text>
					</Container>
				</Section>
			))}
		</div>
	),
};
