import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { DropdownMenu } from "@voila.dev/ui/dropdown-menu";

const meta = {
	title: "UI/DropdownMenu",
	component: DropdownMenu.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger render={<Button variant="outline" />}>
				Project actions
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="w-56">
				<DropdownMenu.Label>Landing page redesign</DropdownMenu.Label>
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						Edit project
						<DropdownMenu.Shortcut>⌘E</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						Duplicate
						<DropdownMenu.Shortcut>⌘D</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>Assign freelancer</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item>Nathan Guyot</DropdownMenu.Item>
						<DropdownMenu.Item>Marie Lefevre</DropdownMenu.Item>
						<DropdownMenu.Item>Paul Martin</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Separator />
				<DropdownMenu.Item variant="destructive">
					Cancel project
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	),
};

export const WithCheckboxItems: Story = {
	render: () => (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger render={<Button variant="outline" />}>
				Notification settings
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="w-56">
				<DropdownMenu.Label>Notify me about</DropdownMenu.Label>
				<DropdownMenu.CheckboxItem defaultChecked>
					New applications
				</DropdownMenu.CheckboxItem>
				<DropdownMenu.CheckboxItem defaultChecked>
					Project reminders
				</DropdownMenu.CheckboxItem>
				<DropdownMenu.CheckboxItem>Weekly digest</DropdownMenu.CheckboxItem>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	),
};

export const WithRadioGroup: Story = {
	render: () => (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger render={<Button variant="outline" />}>
				Sort projects
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="w-48">
				<DropdownMenu.Label>Sort by</DropdownMenu.Label>
				<DropdownMenu.RadioGroup defaultValue="date">
					<DropdownMenu.RadioItem value="date">Date</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="client">Client</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="status">Status</DropdownMenu.RadioItem>
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	),
};
