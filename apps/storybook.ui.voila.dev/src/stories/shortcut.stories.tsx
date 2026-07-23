import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@voila.dev/ui/components/dropdown-menu";
import { Shortcut } from "@voila.dev/ui/components/shortcut";
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
			Rechercher
			<Shortcut>⌘K</Shortcut>
		</div>
	),
};

export const WithKbdKeys: Story = {
	render: () => (
		<div className="flex w-56 items-center rounded-lg border px-3 py-2 text-sm">
			Rechercher
			<Shortcut keys={["⌘", "K"]} />
		</div>
	),
};

export const InDropdownMenu: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger>Mission actions</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>
					Edit mission
					<DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem>
					Duplicate
					<DropdownMenuShortcut keys={["⌘", "D"]} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByText("Mission actions"));
		await waitFor(() =>
			expect(
				document.querySelector("[data-slot=dropdown-menu-shortcut]"),
			).toBeInTheDocument(),
		);
	},
};
