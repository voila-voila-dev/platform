import {
	ArrowRightIcon,
	CalendarCheckIcon,
	UserCircleIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { Item } from "@voila.dev/ui/item";
import { expect } from "storybook/test";

const meta = {
	title: "UI/Item",
	component: Item.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Item.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Item.Root variant="outline" className="max-w-md">
			<Item.Media variant="icon">
				<CalendarCheckIcon />
			</Item.Media>
			<Item.Content>
				<Item.Title>Landing page redesign</Item.Title>
				<Item.Description>
					Designer needed for a marketing site refresh, kickoff June 14, about
					two weeks of work.
				</Item.Description>
			</Item.Content>
			<Item.Actions>
				<Button size="sm" variant="outline">
					Apply
				</Button>
			</Item.Actions>
		</Item.Root>
	),
};

export const Muted: Story = {
	render: () => (
		<Item.Root variant="muted" className="max-w-md">
			<Item.Media variant="icon">
				<UserCircleIcon />
			</Item.Media>
			<Item.Content>
				<Item.Title>Camille Laurent</Item.Title>
				<Item.Description>Copywriter — remote, EU time zones.</Item.Description>
			</Item.Content>
			<Item.Actions>
				<Button size="sm" variant="ghost">
					View profile
				</Button>
			</Item.Actions>
		</Item.Root>
	),
};

export const Group: Story = {
	render: () => (
		<Item.Group className="max-w-md">
			<Item.Root>
				<Item.Content>
					<Item.Title>Project published</Item.Title>
					<Item.Description>
						Northwind Studio — website relaunch.
					</Item.Description>
				</Item.Content>
			</Item.Root>
			<Item.Separator />
			<Item.Root>
				<Item.Content>
					<Item.Title>Application received</Item.Title>
					<Item.Description>
						Camille Laurent applied to your project.
					</Item.Description>
				</Item.Content>
			</Item.Root>
			<Item.Separator />
			<Item.Root>
				<Item.Content>
					<Item.Title>Booking confirmed</Item.Title>
					<Item.Description>
						Your freelancer is booked for June 14.
					</Item.Description>
				</Item.Content>
			</Item.Root>
		</Item.Group>
	),
	play: async ({ canvasElement }) => {
		const separators = canvasElement.querySelectorAll(
			"[data-slot=item-separator]",
		);
		await expect(separators).toHaveLength(2);
		for (const separator of separators) {
			await expect(separator.getBoundingClientRect().height).toBeGreaterThan(0);
		}
	},
};

export const Sizes: Story = {
	render: () => (
		<div className="grid max-w-md gap-4">
			{(["default", "sm", "xs"] as const).map((size) => (
				<Item.Root key={size} size={size} variant="outline">
					<Item.Media variant="icon">
						<CalendarCheckIcon />
					</Item.Media>
					<Item.Content>
						<Item.Title>Landing page redesign ({size})</Item.Title>
						<Item.Description>
							Designer needed for a marketing site refresh.
						</Item.Description>
					</Item.Content>
					<Item.Actions>
						<Button size="sm" variant="outline">
							Apply
						</Button>
					</Item.Actions>
				</Item.Root>
			))}
		</div>
	),
};

export const AsLink: Story = {
	render: () => (
		<Item.Root
			variant="outline"
			className="max-w-md"
			render={
				// biome-ignore lint/a11y/useAnchorContent: Base UI's render prop nests the Item children inside the anchor.
				<a href="#project-detail" />
			}
		>
			<Item.Media variant="icon">
				<CalendarCheckIcon />
			</Item.Media>
			<Item.Content>
				<Item.Title>Landing page redesign</Item.Title>
				<Item.Description>
					Designer needed for a marketing site refresh.
				</Item.Description>
			</Item.Content>
			<Item.Actions>
				<ArrowRightIcon />
			</Item.Actions>
		</Item.Root>
	),
};

export const WithImageMedia: Story = {
	render: () => (
		<Item.Root variant="outline" className="max-w-md">
			<Item.Media variant="image">
				<img
					src="https://api.dicebear.com/9.x/initials/svg?seed=Camille+Laurent"
					alt="Camille Laurent"
				/>
			</Item.Media>
			<Item.Content>
				<Item.Title>Camille Laurent</Item.Title>
				<Item.Description>Copywriter — remote, EU time zones.</Item.Description>
			</Item.Content>
		</Item.Root>
	),
};

export const WithHeaderAndFooter: Story = {
	render: () => (
		<Item.Root variant="outline" className="max-w-md">
			<Item.Header>
				<Item.Title>Landing page redesign</Item.Title>
				<Button size="sm" variant="ghost">
					Edit
				</Button>
			</Item.Header>
			<Item.Content>
				<Item.Description>
					Designer needed for a marketing site refresh, kickoff June 14, about
					two weeks of work.
				</Item.Description>
			</Item.Content>
			<Item.Footer>
				<span className="text-xs text-muted-foreground">
					Published 2 days ago
				</span>
				<Button size="sm" variant="outline">
					Apply
				</Button>
			</Item.Footer>
		</Item.Root>
	),
};
