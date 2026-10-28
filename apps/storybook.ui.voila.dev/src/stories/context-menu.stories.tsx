import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ContextMenu } from "@voila.dev/ui/context-menu";

const meta = {
	title: "UI/ContextMenu",
	component: ContextMenu.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof ContextMenu.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ContextMenu.Root>
			<ContextMenu.Trigger className="flex h-36 w-72 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
				Right-click here
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Label>Project</ContextMenu.Label>
				<ContextMenu.Group>
					<ContextMenu.Item>
						Edit project
						<ContextMenu.Shortcut>⌘E</ContextMenu.Shortcut>
					</ContextMenu.Item>
					<ContextMenu.Item>
						Duplicate
						<ContextMenu.Shortcut>⌘D</ContextMenu.Shortcut>
					</ContextMenu.Item>
				</ContextMenu.Group>
				<ContextMenu.Separator />
				<ContextMenu.Sub>
					<ContextMenu.SubTrigger>Assign freelancer</ContextMenu.SubTrigger>
					<ContextMenu.SubContent>
						<ContextMenu.Item>Nathan Guyot</ContextMenu.Item>
						<ContextMenu.Item>Marie Lefevre</ContextMenu.Item>
						<ContextMenu.Item>Paul Martin</ContextMenu.Item>
					</ContextMenu.SubContent>
				</ContextMenu.Sub>
				<ContextMenu.Separator />
				<ContextMenu.Item variant="destructive">
					Cancel project
				</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	),
};

export const WithSelectionItems: Story = {
	render: () => (
		<ContextMenu.Root>
			<ContextMenu.Trigger className="flex h-36 w-72 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
				Right-click to configure the planning view
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Label>Display</ContextMenu.Label>
				<ContextMenu.CheckboxItem defaultChecked>
					Show confirmed projects
				</ContextMenu.CheckboxItem>
				<ContextMenu.CheckboxItem>Show drafts</ContextMenu.CheckboxItem>
				<ContextMenu.Separator />
				<ContextMenu.Label>Sort by</ContextMenu.Label>
				<ContextMenu.RadioGroup defaultValue="date">
					<ContextMenu.RadioItem value="date">Date</ContextMenu.RadioItem>
					<ContextMenu.RadioItem value="client">Client</ContextMenu.RadioItem>
					<ContextMenu.RadioItem value="freelancer">
						Freelancer
					</ContextMenu.RadioItem>
				</ContextMenu.RadioGroup>
			</ContextMenu.Content>
		</ContextMenu.Root>
	),
};
