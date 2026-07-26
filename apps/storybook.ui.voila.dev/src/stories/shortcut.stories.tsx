import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { DropdownMenu } from "@voila.dev/ui/dropdown-menu";
import { Shortcut } from "@voila.dev/ui/shortcut";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/Shortcut",
	component: Shortcut,
	tags: ["autodocs"],
	args: {
		children: "⌘K",
	},
} satisfies Meta<typeof Shortcut>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="flex w-56 items-center rounded-lg border px-3 py-2 text-sm">
			Search
			<Shortcut>⌘K</Shortcut>
		</div>
	),
};

export const WithKbdKeys: Story = {
	render: () => (
		<div className="flex w-56 items-center rounded-lg border px-3 py-2 text-sm">
			Search
			<Shortcut keys={["⌘", "K"]} />
		</div>
	),
};

export const InDropdownMenu: Story = {
	render: () => (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>Project actions</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item>
					Edit project
					<DropdownMenu.Shortcut>⌘E</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					Duplicate
					<DropdownMenu.Shortcut keys={["⌘", "D"]} />
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByText("Project actions"));
		await waitFor(() =>
			expect(
				document.querySelector("[data-slot=dropdown-menu-shortcut]"),
			).toBeInTheDocument(),
		);
	},
};
