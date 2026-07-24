import {
	CalendarPlusIcon,
	ChatCircleIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Avatar, AvatarFallback } from "@voila.dev/ui/components/avatar";
import { Button } from "@voila.dev/ui/components/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@voila.dev/ui/components/empty";

const meta = {
	title: "UI/Empty",
	component: Empty,
	tags: ["autodocs"],
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-96">
			<Empty bordered>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<CalendarPlusIcon />
					</EmptyMedia>
					<EmptyTitle>No projects yet</EmptyTitle>
					<EmptyDescription>
						Create your first project to start receiving applications from
						freelancers.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button>Create a project</Button>
				</EmptyContent>
			</Empty>
		</div>
	),
};

export const WithSecondaryAction: Story = {
	render: () => (
		<div className="w-96">
			<Empty bordered>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<UsersIcon />
					</EmptyMedia>
					<EmptyTitle>No freelancers found</EmptyTitle>
					<EmptyDescription>
						No freelancer matches your filters. Try widening the search area or
						removing a skill filter.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<div className="flex gap-2">
						<Button variant="outline">Clear filters</Button>
						<Button>Invite a freelancer</Button>
					</div>
				</EmptyContent>
			</Empty>
		</div>
	),
};

export const WithDefaultMedia: Story = {
	render: () => (
		<div className="w-96">
			<Empty bordered>
				<EmptyHeader>
					<EmptyMedia>
						<Avatar>
							<AvatarFallback>NG</AvatarFallback>
						</Avatar>
					</EmptyMedia>
					<EmptyTitle>No conversation selected</EmptyTitle>
					<EmptyDescription>
						Pick a conversation from the list to see the messages.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	),
};

export const WithLinkInDescription: Story = {
	render: () => (
		<div className="w-96">
			<Empty bordered>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ChatCircleIcon />
					</EmptyMedia>
					<EmptyTitle>No messages yet</EmptyTitle>
					<EmptyDescription>
						Start a conversation with a client, or{" "}
						<a href="#help">read the messaging guide</a> to learn more.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	),
};

export const MediaSizes: Story = {
	render: () => (
		<div className="flex w-96 flex-col gap-4">
			{(["sm", "default", "lg"] as const).map((size) => (
				<Empty bordered key={size}>
					<EmptyHeader>
						<EmptyMedia size={size} variant="icon">
							<CalendarPlusIcon />
						</EmptyMedia>
						<EmptyTitle>{size}</EmptyTitle>
					</EmptyHeader>
				</Empty>
			))}
		</div>
	),
};
