import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { Spinner } from "@voila.dev/ui/components/spinner";

const meta = {
	title: "UI/Spinner",
	component: Spinner,
	tags: ["autodocs"],
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Spinner className="size-4" />
			<Spinner className="size-6" />
			<Spinner className="size-8" />
		</div>
	),
};

export const InButton: Story = {
	render: () => (
		<Button disabled>
			<Spinner />
			Publishing project
		</Button>
	),
};

/** The glyph uses `currentColor`, so role tokens tint it directly. */
export const Colors: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Spinner className="text-brand" />
			<Spinner className="text-highlight" />
			<Spinner className="text-destructive" />
			<Spinner className="text-muted-foreground" />
		</div>
	),
};
