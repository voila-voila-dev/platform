import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { PageHeader, sectionBackgroundOptions } from "@voila.dev/ui/landing";

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
				A question, a request, an idea? Write to us and we will get back to you
				quickly.
			</PageHeader.Lead>
		</PageHeader.Root>
	),
} satisfies Meta<typeof PageHeader.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
