import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@voila.dev/ui/components/context-menu";

const meta = {
	title: "UI/ContextMenu",
	component: ContextMenu,
	tags: ["autodocs"],
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ContextMenu>
			<ContextMenuTrigger className="flex h-36 w-72 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
				Right-click here
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuLabel>Mission</ContextMenuLabel>
				<ContextMenuGroup>
					<ContextMenuItem>
						Edit mission
						<ContextMenuShortcut>⌘E</ContextMenuShortcut>
					</ContextMenuItem>
					<ContextMenuItem>
						Duplicate
						<ContextMenuShortcut>⌘D</ContextMenuShortcut>
					</ContextMenuItem>
				</ContextMenuGroup>
				<ContextMenuSeparator />
				<ContextMenuSub>
					<ContextMenuSubTrigger>Assign provider</ContextMenuSubTrigger>
					<ContextMenuSubContent>
						<ContextMenuItem>Nathan Guyot</ContextMenuItem>
						<ContextMenuItem>Marie Lefevre</ContextMenuItem>
						<ContextMenuItem>Paul Martin</ContextMenuItem>
					</ContextMenuSubContent>
				</ContextMenuSub>
				<ContextMenuSeparator />
				<ContextMenuItem variant="destructive">Cancel mission</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	),
};

export const WithSelectionItems: Story = {
	render: () => (
		<ContextMenu>
			<ContextMenuTrigger className="flex h-36 w-72 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
				Right-click to configure the planning view
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuLabel>Display</ContextMenuLabel>
				<ContextMenuCheckboxItem defaultChecked>
					Show confirmed missions
				</ContextMenuCheckboxItem>
				<ContextMenuCheckboxItem>Show drafts</ContextMenuCheckboxItem>
				<ContextMenuSeparator />
				<ContextMenuLabel>Sort by</ContextMenuLabel>
				<ContextMenuRadioGroup defaultValue="date">
					<ContextMenuRadioItem value="date">Date</ContextMenuRadioItem>
					<ContextMenuRadioItem value="club">Club</ContextMenuRadioItem>
					<ContextMenuRadioItem value="provider">Provider</ContextMenuRadioItem>
				</ContextMenuRadioGroup>
			</ContextMenuContent>
		</ContextMenu>
	),
};
