import {
	CalendarPlusIcon,
	ChatCircleIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Avatar } from "@voila.dev/ui/avatar";
import { Button } from "@voila.dev/ui/button";
import { Empty } from "@voila.dev/ui/empty";

const meta = {
	title: "UI/Empty",
	component: Empty.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Empty.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-96">
			<Empty.Root bordered>
				<Empty.Header>
					<Empty.Media variant="icon">
						<CalendarPlusIcon />
					</Empty.Media>
					<Empty.Title>No projects yet</Empty.Title>
					<Empty.Description>
						Create your first project to start receiving applications from
						freelancers.
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button>Create a project</Button>
				</Empty.Content>
			</Empty.Root>
		</div>
	),
};

export const WithSecondaryAction: Story = {
	render: () => (
		<div className="w-96">
			<Empty.Root bordered>
				<Empty.Header>
					<Empty.Media variant="icon">
						<UsersIcon />
					</Empty.Media>
					<Empty.Title>No freelancers found</Empty.Title>
					<Empty.Description>
						No freelancer matches your filters. Try widening the search area or
						removing a skill filter.
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<div className="flex gap-2">
						<Button variant="outline">Clear filters</Button>
						<Button>Invite a freelancer</Button>
					</div>
				</Empty.Content>
			</Empty.Root>
		</div>
	),
};

export const WithDefaultMedia: Story = {
	render: () => (
		<div className="w-96">
			<Empty.Root bordered>
				<Empty.Header>
					<Empty.Media>
						<Avatar.Root>
							<Avatar.Fallback>NG</Avatar.Fallback>
						</Avatar.Root>
					</Empty.Media>
					<Empty.Title>No conversation selected</Empty.Title>
					<Empty.Description>
						Pick a conversation from the list to see the messages.
					</Empty.Description>
				</Empty.Header>
			</Empty.Root>
		</div>
	),
};

export const WithLinkInDescription: Story = {
	render: () => (
		<div className="w-96">
			<Empty.Root bordered>
				<Empty.Header>
					<Empty.Media variant="icon">
						<ChatCircleIcon />
					</Empty.Media>
					<Empty.Title>No messages yet</Empty.Title>
					<Empty.Description>
						Start a conversation with a client, or{" "}
						<a href="#help">read the messaging guide</a> to learn more.
					</Empty.Description>
				</Empty.Header>
			</Empty.Root>
		</div>
	),
};

export const MediaSizes: Story = {
	render: () => (
		<div className="flex w-96 flex-col gap-4">
			{(["sm", "default", "lg"] as const).map((size) => (
				<Empty.Root bordered key={size}>
					<Empty.Header>
						<Empty.Media size={size} variant="icon">
							<CalendarPlusIcon />
						</Empty.Media>
						<Empty.Title>{size}</Empty.Title>
					</Empty.Header>
				</Empty.Root>
			))}
		</div>
	),
};
