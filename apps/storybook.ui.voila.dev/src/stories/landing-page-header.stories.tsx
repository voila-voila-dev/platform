import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { PageHeader } from "@voila.dev/ui-landing/components/page-header";
import { sectionBackgroundOptions } from "@voila.dev/ui-landing/components/section";

const meta = {
	title: "Landing/PageHeader",
	component: PageHeader.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		background: {
			control: "select",
			options: sectionBackgroundOptions,
		},
	},
	render: (args) => (
		<PageHeader.Root {...args}>
			<PageHeader.Title>Contact</PageHeader.Title>
			<PageHeader.Lead>
				Une question, un besoin, une idée ? Écrivez-nous, on vous répond
				rapidement.
			</PageHeader.Lead>
		</PageHeader.Root>
	),
} satisfies Meta<typeof PageHeader.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
