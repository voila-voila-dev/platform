import { StarIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Toggle } from "@voila.dev/ui/toggle";

const meta = {
	title: "UI/Toggle",
	component: Toggle,
	tags: ["autodocs"],
	args: {
		children: "Favorite",
		"aria-label": "Mark freelancer as favorite",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "outline"],
		},
		size: {
			control: "select",
			options: ["default", "sm", "lg"],
		},
	},
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Pressed swaps the outline star for a filled one via `group-data-pressed` -
 * the icon change makes the pressed state readable beyond the background.
 * `data-icon="inline-start"` opts into the tighter icon-side padding.
 */
export const WithIcon: Story = {
	render: () => (
		<Toggle aria-label="Mark freelancer as favorite">
			<StarIcon
				data-icon="inline-start"
				className="group-data-pressed/toggle:hidden"
			/>
			<StarIcon
				data-icon="inline-start"
				weight="fill"
				className="hidden group-data-pressed/toggle:inline"
			/>
			Favorite
		</Toggle>
	),
};

export const Outline: Story = {
	render: () => (
		<Toggle variant="outline" defaultPressed>
			Available on weekends
		</Toggle>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Toggle size="sm" variant="outline">
				Small
			</Toggle>
			<Toggle size="default" variant="outline">
				Default
			</Toggle>
			<Toggle size="lg" variant="outline">
				Large
			</Toggle>
		</div>
	),
};

export const Disabled: Story = {
	args: {
		variant: "outline",
		size: "sm",
	},

	render: () => (
		<div className="flex items-center gap-4">
			<Toggle variant="outline" disabled>
				Unavailable
			</Toggle>
			<Toggle variant="outline" disabled defaultPressed>
				Locked on
			</Toggle>
		</div>
	),
};

export const Invalid: Story = {
	render: () => (
		<Toggle variant="outline" aria-invalid>
			Pick at least one day
		</Toggle>
	),
};
