import {
	CalendarIcon,
	CaretLeftIcon,
	CaretRightIcon,
	MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import {
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
} from "@voila.dev/ui/components/button-group";
import { Input } from "@voila.dev/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@voila.dev/ui/components/select";
import { useState } from "react";

const meta = {
	title: "UI/ButtonGroup",
	component: ButtonGroup,
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
	},
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ButtonGroup>
			<Button variant="outline">Day</Button>
			<Button variant="outline">Week</Button>
			<Button variant="outline">Month</Button>
		</ButtonGroup>
	),
};

export const WithText: Story = {
	render: () => (
		<ButtonGroup>
			<ButtonGroupText>
				<CalendarIcon />
				June 2026
			</ButtonGroupText>
			<ButtonGroupSeparator />
			<Button variant="outline" size="icon" aria-label="Previous month">
				<CaretLeftIcon />
			</Button>
			<Button variant="outline" size="icon" aria-label="Next month">
				<CaretRightIcon />
			</Button>
		</ButtonGroup>
	),
};

export const Vertical: Story = {
	render: () => (
		<ButtonGroup orientation="vertical">
			<Button variant="outline">Accept application</Button>
			<Button variant="outline">Message provider</Button>
			<Button variant="outline">Decline</Button>
		</ButtonGroup>
	),
};

export const VerticalWithSeparator: Story = {
	render: () => (
		<ButtonGroup orientation="vertical">
			<Button variant="outline">Accept application</Button>
			<Button variant="outline">Message provider</Button>
			<ButtonGroupSeparator />
			<Button variant="outline">Decline</Button>
		</ButtonGroup>
	),
};

export const WithInput: Story = {
	render: () => (
		<ButtonGroup aria-label="Search missions" className="w-80">
			<Input type="search" placeholder="Search missions…" />
			<Button variant="outline" size="icon" aria-label="Search">
				<MagnifyingGlassIcon />
			</Button>
		</ButtonGroup>
	),
};

export const WithSelect: Story = {
	render: () => (
		<ButtonGroup aria-label="Filter by specialty">
			<Select defaultValue="physiotherapist">
				<SelectTrigger>
					<SelectValue placeholder="Specialty" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="physiotherapist">Physiotherapist</SelectItem>
					<SelectItem value="osteopath">Osteopath</SelectItem>
					<SelectItem value="nurse">Nurse</SelectItem>
				</SelectContent>
			</Select>
			<Button variant="outline">Apply</Button>
		</ButtonGroup>
	),
};

export const NestedGroups: Story = {
	render: () => (
		<ButtonGroup aria-label="Pagination">
			<ButtonGroup>
				<Button variant="outline" size="icon" aria-label="Previous page">
					<CaretLeftIcon />
				</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="outline">1</Button>
				<Button variant="outline">2</Button>
				<Button variant="outline">3</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="outline" size="icon" aria-label="Next page">
					<CaretRightIcon />
				</Button>
			</ButtonGroup>
		</ButtonGroup>
	),
};

export const WithDisabledMember: Story = {
	render: () => (
		<ButtonGroup aria-label="Booking actions">
			<Button variant="outline">Accept</Button>
			<Button variant="outline" disabled>
				Message
			</Button>
			<Button variant="outline">Decline</Button>
		</ButtonGroup>
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
			<ButtonGroup aria-label="Calendar period">
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
			</ButtonGroup>
		);
	},
};
