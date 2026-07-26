import {
	TextAlignCenterIcon,
	TextAlignLeftIcon,
	TextAlignRightIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ToggleGroup } from "@voila.dev/ui/toggle-group";

const meta = {
	title: "UI/ToggleGroup",
	component: ToggleGroup.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof ToggleGroup.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ToggleGroup.Root defaultValue={["week"]} variant="outline">
			<ToggleGroup.Item value="day">Day</ToggleGroup.Item>
			<ToggleGroup.Item value="week">Week</ToggleGroup.Item>
			<ToggleGroup.Item value="month">Month</ToggleGroup.Item>
		</ToggleGroup.Root>
	),
};

export const Multiple: Story = {
	render: () => (
		<ToggleGroup.Root
			multiple
			defaultValue={["designer", "developer"]}
			variant="outline"
		>
			<ToggleGroup.Item value="designer">Designer</ToggleGroup.Item>
			<ToggleGroup.Item value="developer">Developer</ToggleGroup.Item>
			<ToggleGroup.Item value="copywriter">Copywriter</ToggleGroup.Item>
		</ToggleGroup.Root>
	),
};

export const WithIcons: Story = {
	render: () => (
		<ToggleGroup.Root defaultValue={["left"]}>
			<ToggleGroup.Item value="left" aria-label="Align left">
				<TextAlignLeftIcon />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="center" aria-label="Align center">
				<TextAlignCenterIcon />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="right" aria-label="Align right">
				<TextAlignRightIcon />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	),
};

export const WithSpacing: Story = {
	render: () => (
		<ToggleGroup.Root defaultValue={["week"]} variant="outline" spacing={2}>
			<ToggleGroup.Item value="day">Day</ToggleGroup.Item>
			<ToggleGroup.Item value="week">Week</ToggleGroup.Item>
			<ToggleGroup.Item value="month">Month</ToggleGroup.Item>
		</ToggleGroup.Root>
	),
};
