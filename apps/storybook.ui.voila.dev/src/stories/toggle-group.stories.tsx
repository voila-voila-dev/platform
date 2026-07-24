import {
	TextAlignCenterIcon,
	TextAlignLeftIcon,
	TextAlignRightIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@voila.dev/ui/components/toggle-group";

const meta = {
	title: "UI/ToggleGroup",
	component: ToggleGroup,
	tags: ["autodocs"],
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ToggleGroup defaultValue={["week"]} variant="outline">
			<ToggleGroupItem value="day">Day</ToggleGroupItem>
			<ToggleGroupItem value="week">Week</ToggleGroupItem>
			<ToggleGroupItem value="month">Month</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const Multiple: Story = {
	render: () => (
		<ToggleGroup
			multiple
			defaultValue={["designer", "developer"]}
			variant="outline"
		>
			<ToggleGroupItem value="designer">Designer</ToggleGroupItem>
			<ToggleGroupItem value="developer">Developer</ToggleGroupItem>
			<ToggleGroupItem value="copywriter">Copywriter</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const WithIcons: Story = {
	render: () => (
		<ToggleGroup defaultValue={["left"]}>
			<ToggleGroupItem value="left" aria-label="Align left">
				<TextAlignLeftIcon />
			</ToggleGroupItem>
			<ToggleGroupItem value="center" aria-label="Align center">
				<TextAlignCenterIcon />
			</ToggleGroupItem>
			<ToggleGroupItem value="right" aria-label="Align right">
				<TextAlignRightIcon />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const WithSpacing: Story = {
	render: () => (
		<ToggleGroup defaultValue={["week"]} variant="outline" spacing={2}>
			<ToggleGroupItem value="day">Day</ToggleGroupItem>
			<ToggleGroupItem value="week">Week</ToggleGroupItem>
			<ToggleGroupItem value="month">Month</ToggleGroupItem>
		</ToggleGroup>
	),
};
