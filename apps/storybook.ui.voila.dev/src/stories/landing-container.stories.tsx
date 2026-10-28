import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Container, containerSizeOptions } from "@voila.dev/ui/landing";

const meta = {
	title: "Landing/Container",
	component: Container,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		size: {
			control: "select",
			options: containerSizeOptions,
		},
	},
	args: {
		size: "xl",
	},
	render: (args) => (
		<Container {...args}>
			<div className="rounded-lg border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
				max-width {args.size}
			</div>
		</Container>
	),
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
	render: () => (
		<div className="space-y-4 py-4">
			{containerSizeOptions.map((size) => (
				<Container key={size} size={size}>
					<div className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
						{size}
					</div>
				</Container>
			))}
		</div>
	),
};
