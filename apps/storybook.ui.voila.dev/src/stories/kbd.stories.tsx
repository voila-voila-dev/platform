import { ArrowUUpLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { InputGroup } from "@voila.dev/ui/input-group";
import { Kbd } from "@voila.dev/ui/kbd";
import { Tooltip } from "@voila.dev/ui/tooltip";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/Kbd",
	component: Kbd.Root,
	tags: ["autodocs"],
	args: {
		children: "⌘K",
	},
} satisfies Meta<typeof Kbd.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Kbd.Root size="default">⌘K</Kbd.Root>
			<Kbd.Root size="sm">⌘K</Kbd.Root>
		</div>
	),
};

export const Group: Story = {
	render: () => (
		<Kbd.Group>
			<Kbd.Root>⌘</Kbd.Root>
			<Kbd.Root>⇧</Kbd.Root>
			<Kbd.Root>P</Kbd.Root>
		</Kbd.Group>
	),
};

export const GroupWithSeparator: Story = {
	render: () => (
		<Kbd.Group separator="+">
			<Kbd.Root>⌘</Kbd.Root>
			<Kbd.Root>⇧</Kbd.Root>
			<Kbd.Root>P</Kbd.Root>
		</Kbd.Group>
	),
};

export const WithIcon: Story = {
	render: () => (
		<Kbd.Group>
			<Kbd.Root>
				<MagnifyingGlassIcon />
			</Kbd.Root>
			<Kbd.Root>
				<ArrowUUpLeftIcon />
				Enter
			</Kbd.Root>
		</Kbd.Group>
	),
};

export const InText: Story = {
	render: () => (
		<p className="text-muted-foreground text-sm">
			Press <Kbd.Root>⌘</Kbd.Root> <Kbd.Root>K</Kbd.Root> to search projects and
			freelancers.
		</p>
	),
};

export const InTooltip: Story = {
	render: () => (
		<Tooltip.Root>
			<Tooltip.Trigger render={<Button variant="outline" />}>
				Search
			</Tooltip.Trigger>
			<Tooltip.Content>
				Search projects and freelancers
				<Kbd.Group>
					<Kbd.Root>⌘</Kbd.Root>
					<Kbd.Root>K</Kbd.Root>
				</Kbd.Group>
			</Tooltip.Content>
		</Tooltip.Root>
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
			<InputGroup.Root>
				<InputGroup.Addon>
					<MagnifyingGlassIcon />
				</InputGroup.Addon>
				<InputGroup.Input placeholder="Search freelancers..." />
				<InputGroup.Addon align="inline-end">
					<Kbd.Root>⌘K</Kbd.Root>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	),
};
