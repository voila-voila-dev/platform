import { ArrowUUpLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@voila.dev/ui/components/input-group";
import { Kbd, KbdGroup } from "@voila.dev/ui/components/kbd";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@voila.dev/ui/components/tooltip";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/Kbd",
	component: Kbd,
	tags: ["autodocs"],
	args: {
		children: "⌘K",
	},
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Kbd size="default">⌘K</Kbd>
			<Kbd size="sm">⌘K</Kbd>
		</div>
	),
};

export const Group: Story = {
	render: () => (
		<KbdGroup>
			<Kbd>⌘</Kbd>
			<Kbd>⇧</Kbd>
			<Kbd>P</Kbd>
		</KbdGroup>
	),
};

export const GroupWithSeparator: Story = {
	render: () => (
		<KbdGroup separator="+">
			<Kbd>⌘</Kbd>
			<Kbd>⇧</Kbd>
			<Kbd>P</Kbd>
		</KbdGroup>
	),
};

export const WithIcon: Story = {
	render: () => (
		<KbdGroup>
			<Kbd>
				<MagnifyingGlassIcon />
			</Kbd>
			<Kbd>
				<ArrowUUpLeftIcon />
				Enter
			</Kbd>
		</KbdGroup>
	),
};

export const InText: Story = {
	render: () => (
		<p className="text-muted-foreground text-sm">
			Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search projects and freelancers.
		</p>
	),
};

export const InTooltip: Story = {
	render: () => (
		<Tooltip>
			<TooltipTrigger render={<Button variant="outline" />}>
				Search
			</TooltipTrigger>
			<TooltipContent>
				Search projects and freelancers
				<KbdGroup>
					<Kbd>⌘</Kbd>
					<Kbd>K</Kbd>
				</KbdGroup>
			</TooltipContent>
		</Tooltip>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.hover(canvas.getByRole("button", { name: "Search" }));
		await waitFor(() =>
			expect(
				document.querySelector("[data-slot=tooltip-content] [data-slot=kbd]"),
			).toBeInTheDocument(),
		);
	},
};

export const InInputGroup: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup>
				<InputGroupAddon>
					<MagnifyingGlassIcon />
				</InputGroupAddon>
				<InputGroupInput placeholder="Search freelancers..." />
				<InputGroupAddon align="inline-end">
					<Kbd>⌘K</Kbd>
				</InputGroupAddon>
			</InputGroup>
		</div>
	),
};
