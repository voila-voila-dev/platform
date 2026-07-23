import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@voila.dev/ui/components/dropdown-menu";

const meta = {
	title: "UI/DropdownMenu",
	component: DropdownMenu,
	tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				Mission actions
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Match coverage — Saturday</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem>
						Edit mission
						<DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						Duplicate
						<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>Assign provider</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>Nathan Guyot</DropdownMenuItem>
						<DropdownMenuItem>Marie Lefevre</DropdownMenuItem>
						<DropdownMenuItem>Paul Martin</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					Cancel mission
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

export const WithCheckboxItems: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				Notification settings
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Notify me about</DropdownMenuLabel>
				<DropdownMenuCheckboxItem defaultChecked>
					New applications
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem defaultChecked>
					Mission reminders
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem>Weekly digest</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

export const WithRadioGroup: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				Sort missions
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48">
				<DropdownMenuLabel>Sort by</DropdownMenuLabel>
				<DropdownMenuRadioGroup defaultValue="date">
					<DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="club">Club</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};
