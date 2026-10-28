import {
	CalendarIcon,
	CaretLeftIcon,
	CaretRightIcon,
	MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { ButtonGroup } from "@voila.dev/ui/button-group";
import { Input } from "@voila.dev/ui/input";
import { Select } from "@voila.dev/ui/select";
import { useState } from "react";

const meta = {
	title: "UI/ButtonGroup",
	component: ButtonGroup.Root,
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
	},
} satisfies Meta<typeof ButtonGroup.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ButtonGroup.Root>
			<Button variant="outline">Day</Button>
			<Button variant="outline">Week</Button>
			<Button variant="outline">Month</Button>
		</ButtonGroup.Root>
	),
};

export const WithText: Story = {
	render: () => (
		<ButtonGroup.Root>
			<ButtonGroup.Text>
				<CalendarIcon />
				June 2026
			</ButtonGroup.Text>
			<ButtonGroup.Separator />
			<Button variant="outline" size="icon" aria-label="Previous month">
				<CaretLeftIcon />
			</Button>
			<Button variant="outline" size="icon" aria-label="Next month">
				<CaretRightIcon />
			</Button>
		</ButtonGroup.Root>
	),
};

export const Vertical: Story = {
	render: () => (
		<ButtonGroup.Root orientation="vertical">
			<Button variant="outline">Accept application</Button>
			<Button variant="outline">Message freelancer</Button>
			<Button variant="outline">Decline</Button>
		</ButtonGroup.Root>
	),
};

export const VerticalWithSeparator: Story = {
	render: () => (
		<ButtonGroup.Root orientation="vertical">
			<Button variant="outline">Accept application</Button>
			<Button variant="outline">Message freelancer</Button>
			<ButtonGroup.Separator />
			<Button variant="outline">Decline</Button>
		</ButtonGroup.Root>
	),
};

export const WithInput: Story = {
	render: () => (
		<ButtonGroup.Root aria-label="Search projects" className="w-80">
			<Input type="search" placeholder="Search projects…" />
			<Button variant="outline" size="icon" aria-label="Search">
				<MagnifyingGlassIcon />
			</Button>
		</ButtonGroup.Root>
	),
};

export const WithSelect: Story = {
	render: () => (
		<ButtonGroup.Root aria-label="Filter by role">
			<Select.Root defaultValue="designer">
				<Select.Trigger>
					<Select.Value placeholder="Role" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="designer">Designer</Select.Item>
					<Select.Item value="developer">Developer</Select.Item>
					<Select.Item value="copywriter">Copywriter</Select.Item>
				</Select.Content>
			</Select.Root>
			<Button variant="outline">Apply</Button>
		</ButtonGroup.Root>
	),
};

export const NestedGroups: Story = {
	render: () => (
		<ButtonGroup.Root aria-label="Pagination">
			<ButtonGroup.Root>
				<Button variant="outline" size="icon" aria-label="Previous page">
					<CaretLeftIcon />
				</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root>
				<Button variant="outline">1</Button>
				<Button variant="outline">2</Button>
				<Button variant="outline">3</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root>
				<Button variant="outline" size="icon" aria-label="Next page">
					<CaretRightIcon />
				</Button>
			</ButtonGroup.Root>
		</ButtonGroup.Root>
	),
};

export const WithDisabledMember: Story = {
	render: () => (
		<ButtonGroup.Root aria-label="Proposal actions">
			<Button variant="outline">Accept</Button>
			<Button variant="outline" disabled>
				Message
			</Button>
			<Button variant="outline">Decline</Button>
		</ButtonGroup.Root>
	),
};

/**
 * A single-select segmented control is semantically a `ToggleGroup`; this
 * story only demonstrates the visual treatment with plain buttons.
 */
export const ActiveSegment: Story = {
	render: function ActiveSegmentStory() {
		const [period, setPeriod] = useState("Week");
		return (
			<ButtonGroup.Root aria-label="Calendar period">
				{["Day", "Week", "Month"].map((label) => (
					<Button
						key={label}
						variant={period === label ? "default" : "outline"}
						aria-pressed={period === label}
						onClick={() => setPeriod(label)}
					>
						{label}
					</Button>
				))}
			</ButtonGroup.Root>
		);
	},
};
