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
				<ContextMenuLabel>Project</ContextMenuLabel>
				<ContextMenuGroup>
					<ContextMenuItem>
						Edit project
						<ContextMenuShortcut>⌘E</ContextMenuShortcut>
					</ContextMenuItem>
					<ContextMenuItem>
						Duplicate
						<ContextMenuShortcut>⌘D</ContextMenuShortcut>
					</ContextMenuItem>
				</ContextMenuGroup>
				<ContextMenuSeparator />
				<ContextMenuSub>
					<ContextMenuSubTrigger>Assign freelancer</ContextMenuSubTrigger>
					<ContextMenuSubContent>
						<ContextMenuItem>Nathan Guyot</ContextMenuItem>
						<ContextMenuItem>Marie Lefevre</ContextMenuItem>
						<ContextMenuItem>Paul Martin</ContextMenuItem>
					</ContextMenuSubContent>
				</ContextMenuSub>
				<ContextMenuSeparator />
				<ContextMenuItem variant="destructive">Cancel project</ContextMenuItem>
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
					Show confirmed projects
				</ContextMenuCheckboxItem>
				<ContextMenuCheckboxItem>Show drafts</ContextMenuCheckboxItem>
				<ContextMenuSeparator />
				<ContextMenuLabel>Sort by</ContextMenuLabel>
				<ContextMenuRadioGroup defaultValue="date">
					<ContextMenuRadioItem value="date">Date</ContextMenuRadioItem>
					<ContextMenuRadioItem value="client">Client</ContextMenuRadioItem>
					<ContextMenuRadioItem value="freelancer">
						Freelancer
					</ContextMenuRadioItem>
				</ContextMenuRadioGroup>
			</ContextMenuContent>
		</ContextMenu>
	),
};
