import {
	ArrowRightIcon,
	CalendarCheckIcon,
	UserCircleIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemGroup,
	ItemHeader,
	ItemMedia,
	ItemSeparator,
	ItemTitle,
} from "@voila.dev/ui/components/item";
import { expect } from "storybook/test";

const meta = {
	title: "UI/Item",
	component: Item,
	tags: ["autodocs"],
} satisfies Meta<typeof Item>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Item variant="outline" className="max-w-md">
			<ItemMedia variant="icon">
				<CalendarCheckIcon />
			</ItemMedia>
			<ItemContent>
				<ItemTitle>Saturday match coverage</ItemTitle>
				<ItemDescription>
					Physiotherapist needed for the senior rugby team, June 14 from 14:00
					to 18:00.
				</ItemDescription>
			</ItemContent>
			<ItemActions>
				<Button size="sm" variant="outline">
					Apply
				</Button>
			</ItemActions>
		</Item>
	),
};

export const Muted: Story = {
	render: () => (
		<Item variant="muted" className="max-w-md">
			<ItemMedia variant="icon">
				<UserCircleIcon />
			</ItemMedia>
			<ItemContent>
				<ItemTitle>Camille Laurent</ItemTitle>
				<ItemDescription>Osteopath — Rennes and surroundings.</ItemDescription>
			</ItemContent>
			<ItemActions>
				<Button size="sm" variant="ghost">
					View profile
				</Button>
			</ItemActions>
		</Item>
	),
};

export const Group: Story = {
	render: () => (
		<ItemGroup className="max-w-md">
			<Item>
				<ItemContent>
					<ItemTitle>Mission published</ItemTitle>
					<ItemDescription>Stade Rennais — tournament day.</ItemDescription>
				</ItemContent>
			</Item>
			<ItemSeparator />
			<Item>
				<ItemContent>
					<ItemTitle>Application received</ItemTitle>
					<ItemDescription>
						Camille Laurent applied to your mission.
					</ItemDescription>
				</ItemContent>
			</Item>
			<ItemSeparator />
			<Item>
				<ItemContent>
					<ItemTitle>Booking confirmed</ItemTitle>
					<ItemDescription>
						Your provider is booked for June 14.
					</ItemDescription>
				</ItemContent>
			</Item>
		</ItemGroup>
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
				<Item key={size} size={size} variant="outline">
					<ItemMedia variant="icon">
						<CalendarCheckIcon />
					</ItemMedia>
					<ItemContent>
						<ItemTitle>Saturday match coverage ({size})</ItemTitle>
						<ItemDescription>
							Physiotherapist needed for the senior rugby team.
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Button size="sm" variant="outline">
							Apply
						</Button>
					</ItemActions>
				</Item>
			))}
		</div>
	),
};

export const AsLink: Story = {
	render: () => (
		<Item
			variant="outline"
			className="max-w-md"
			render={
				// biome-ignore lint/a11y/useAnchorContent: Base UI's render prop nests the Item children inside the anchor.
				<a href="#mission-detail" />
			}
		>
			<ItemMedia variant="icon">
				<CalendarCheckIcon />
			</ItemMedia>
			<ItemContent>
				<ItemTitle>Saturday match coverage</ItemTitle>
				<ItemDescription>
					Physiotherapist needed for the senior rugby team.
				</ItemDescription>
			</ItemContent>
			<ItemActions>
				<ArrowRightIcon />
			</ItemActions>
		</Item>
	),
};

export const WithImageMedia: Story = {
	render: () => (
		<Item variant="outline" className="max-w-md">
			<ItemMedia variant="image">
				<img
					src="https://api.dicebear.com/9.x/initials/svg?seed=Camille+Laurent"
					alt="Camille Laurent"
				/>
			</ItemMedia>
			<ItemContent>
				<ItemTitle>Camille Laurent</ItemTitle>
				<ItemDescription>Osteopath — Rennes and surroundings.</ItemDescription>
			</ItemContent>
		</Item>
	),
};

export const WithHeaderAndFooter: Story = {
	render: () => (
		<Item variant="outline" className="max-w-md">
			<ItemHeader>
				<ItemTitle>Saturday match coverage</ItemTitle>
				<Button size="sm" variant="ghost">
					Edit
				</Button>
			</ItemHeader>
			<ItemContent>
				<ItemDescription>
					Physiotherapist needed for the senior rugby team, June 14 from 14:00
					to 18:00.
				</ItemDescription>
			</ItemContent>
			<ItemFooter>
				<span className="text-xs text-muted-foreground">
					Published 2 days ago
				</span>
				<Button size="sm" variant="outline">
					Apply
				</Button>
			</ItemFooter>
		</Item>
	),
};
