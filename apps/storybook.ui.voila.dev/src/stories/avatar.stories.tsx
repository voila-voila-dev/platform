import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Avatar } from "@voila.dev/ui/avatar";

const meta = {
	title: "UI/Avatar",
	component: Avatar.Root,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "default", "lg"],
		},
	},
	args: {
		size: "default",
	},
} satisfies Meta<typeof Avatar.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Avatar.Root {...args}>
			<Avatar.Image src="https://github.com/shadcn.png" alt="Camille Dubois" />
			<Avatar.Fallback>CD</Avatar.Fallback>
		</Avatar.Root>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Avatar.Root size="sm">
				<Avatar.Fallback>CD</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root size="default">
				<Avatar.Fallback>CD</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root size="lg">
				<Avatar.Fallback>CD</Avatar.Fallback>
			</Avatar.Root>
		</div>
	),
};

export const Fallback: Story = {
	render: (args) => (
		<Avatar.Root {...args}>
			<Avatar.Fallback>CD</Avatar.Fallback>
		</Avatar.Root>
	),
};

export const BrokenImage: Story = {
	render: (args) => (
		<Avatar.Root {...args}>
			<Avatar.Image
				src="https://acme.dev/this-image-does-not-exist.png"
				alt="Camille Dubois"
			/>
			<Avatar.Fallback>CD</Avatar.Fallback>
		</Avatar.Root>
	),
};

export const WithBadge: Story = {
	render: () => (
		<Avatar.Root size="lg">
			<Avatar.Image src="https://github.com/shadcn.png" alt="Camille Dubois" />
			<Avatar.Fallback>CD</Avatar.Fallback>
			<Avatar.Badge status="online" />
		</Avatar.Root>
	),
};

export const BadgeStatuses: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Avatar.Root size="lg">
				<Avatar.Image
					src="https://github.com/shadcn.png"
					alt="Camille Dubois"
				/>
				<Avatar.Fallback>CD</Avatar.Fallback>
				<Avatar.Badge status="online" />
			</Avatar.Root>
			<Avatar.Root size="lg">
				<Avatar.Image src="https://github.com/leerob.png" alt="Nathan Guyot" />
				<Avatar.Fallback>NG</Avatar.Fallback>
				<Avatar.Badge status="busy" />
			</Avatar.Root>
			<Avatar.Root size="lg">
				<Avatar.Image
					src="https://github.com/evilrabbit.png"
					alt="Lea Martin"
				/>
				<Avatar.Fallback>LM</Avatar.Fallback>
				<Avatar.Badge status="offline" />
			</Avatar.Root>
		</div>
	),
};

export const Group: Story = {
	render: () => (
		<Avatar.Group>
			<Avatar.Root>
				<Avatar.Image
					src="https://github.com/shadcn.png"
					alt="Camille Dubois"
				/>
				<Avatar.Fallback>CD</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Image src="https://github.com/leerob.png" alt="Nathan Guyot" />
				<Avatar.Fallback>NG</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Image
					src="https://github.com/evilrabbit.png"
					alt="Lea Martin"
				/>
				<Avatar.Fallback>LM</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.GroupCount aria-label="2 more participants">+2</Avatar.GroupCount>
		</Avatar.Group>
	),
};

export const GroupSizes: Story = {
	render: () => (
		<div className="flex flex-col items-start gap-4">
			<Avatar.Group>
				<Avatar.Root size="sm">
					<Avatar.Fallback>CD</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root size="sm">
					<Avatar.Fallback>NG</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.GroupCount size="sm" aria-label="2 more participants">
					+2
				</Avatar.GroupCount>
			</Avatar.Group>
			<Avatar.Group>
				<Avatar.Root>
					<Avatar.Fallback>CD</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Fallback>NG</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.GroupCount aria-label="2 more participants">
					+2
				</Avatar.GroupCount>
			</Avatar.Group>
			<Avatar.Group>
				<Avatar.Root size="lg">
					<Avatar.Fallback>CD</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root size="lg">
					<Avatar.Fallback>NG</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.GroupCount size="lg" aria-label="2 more participants">
					+2
				</Avatar.GroupCount>
			</Avatar.Group>
		</div>
	),
};
