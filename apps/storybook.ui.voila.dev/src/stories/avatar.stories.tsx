import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "@voila.dev/ui/components/avatar";

const meta = {
	title: "UI/Avatar",
	component: Avatar,
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
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Avatar {...args}>
			<AvatarImage src="https://github.com/shadcn.png" alt="Camille Dubois" />
			<AvatarFallback>CD</AvatarFallback>
		</Avatar>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Avatar size="sm">
				<AvatarFallback>CD</AvatarFallback>
			</Avatar>
			<Avatar size="default">
				<AvatarFallback>CD</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarFallback>CD</AvatarFallback>
			</Avatar>
		</div>
	),
};

export const Fallback: Story = {
	render: (args) => (
		<Avatar {...args}>
			<AvatarFallback>CD</AvatarFallback>
		</Avatar>
	),
};

export const BrokenImage: Story = {
	render: (args) => (
		<Avatar {...args}>
			<AvatarImage
				src="https://acme.dev/this-image-does-not-exist.png"
				alt="Camille Dubois"
			/>
			<AvatarFallback>CD</AvatarFallback>
		</Avatar>
	),
};

export const WithBadge: Story = {
	render: () => (
		<Avatar size="lg">
			<AvatarImage src="https://github.com/shadcn.png" alt="Camille Dubois" />
			<AvatarFallback>CD</AvatarFallback>
			<AvatarBadge status="online" />
		</Avatar>
	),
};

export const BadgeStatuses: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Avatar size="lg">
				<AvatarImage src="https://github.com/shadcn.png" alt="Camille Dubois" />
				<AvatarFallback>CD</AvatarFallback>
				<AvatarBadge status="online" />
			</Avatar>
			<Avatar size="lg">
				<AvatarImage src="https://github.com/leerob.png" alt="Nathan Guyot" />
				<AvatarFallback>NG</AvatarFallback>
				<AvatarBadge status="busy" />
			</Avatar>
			<Avatar size="lg">
				<AvatarImage src="https://github.com/evilrabbit.png" alt="Lea Martin" />
				<AvatarFallback>LM</AvatarFallback>
				<AvatarBadge status="offline" />
			</Avatar>
		</div>
	),
};

export const Group: Story = {
	render: () => (
		<AvatarGroup>
			<Avatar>
				<AvatarImage src="https://github.com/shadcn.png" alt="Camille Dubois" />
				<AvatarFallback>CD</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarImage src="https://github.com/leerob.png" alt="Nathan Guyot" />
				<AvatarFallback>NG</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarImage src="https://github.com/evilrabbit.png" alt="Lea Martin" />
				<AvatarFallback>LM</AvatarFallback>
			</Avatar>
			<AvatarGroupCount aria-label="2 more participants">+2</AvatarGroupCount>
		</AvatarGroup>
	),
};

export const GroupSizes: Story = {
	render: () => (
		<div className="flex flex-col items-start gap-4">
			<AvatarGroup>
				<Avatar size="sm">
					<AvatarFallback>CD</AvatarFallback>
				</Avatar>
				<Avatar size="sm">
					<AvatarFallback>NG</AvatarFallback>
				</Avatar>
				<AvatarGroupCount size="sm" aria-label="2 more participants">
					+2
				</AvatarGroupCount>
			</AvatarGroup>
			<AvatarGroup>
				<Avatar>
					<AvatarFallback>CD</AvatarFallback>
				</Avatar>
				<Avatar>
					<AvatarFallback>NG</AvatarFallback>
				</Avatar>
				<AvatarGroupCount aria-label="2 more participants">+2</AvatarGroupCount>
			</AvatarGroup>
			<AvatarGroup>
				<Avatar size="lg">
					<AvatarFallback>CD</AvatarFallback>
				</Avatar>
				<Avatar size="lg">
					<AvatarFallback>NG</AvatarFallback>
				</Avatar>
				<AvatarGroupCount size="lg" aria-label="2 more participants">
					+2
				</AvatarGroupCount>
			</AvatarGroup>
		</div>
	),
};
