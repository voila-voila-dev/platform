import {
	CalendarCheckIcon,
	FirstAidKitIcon,
	UserCircleIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import {
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@voila.dev/ui/components/item";
import { List, ListItem, ListSeparator } from "@voila.dev/ui/components/list";
import { expect, within } from "storybook/test";

const meta = {
	title: "UI/List",
	component: List,
	tags: ["autodocs"],
} satisfies Meta<typeof List>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<List aria-label="Open missions" className="max-w-md">
			<ListItem variant="outline">
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
			</ListItem>
			<ListItem variant="outline">
				<ItemMedia variant="icon">
					<FirstAidKitIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Tournament first aid</ItemTitle>
					<ItemDescription>
						Two nurses for the youth handball tournament, June 21, full day.
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button size="sm" variant="outline">
						Apply
					</Button>
				</ItemActions>
			</ListItem>
		</List>
	),
};

export const WithSeparator: Story = {
	render: () => (
		<List aria-label="Providers" className="max-w-md gap-0">
			<ListItem>
				<ItemMedia variant="icon">
					<UserCircleIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Dr Dupont</ItemTitle>
					<ItemDescription>Physiotherapist — Lyon</ItemDescription>
				</ItemContent>
			</ListItem>
			<ListSeparator />
			<ListItem>
				<ItemMedia variant="icon">
					<UserCircleIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Dr Martin</ItemTitle>
					<ItemDescription>Osteopath — Villeurbanne</ItemDescription>
				</ItemContent>
			</ListItem>
		</List>
	),
};

export const Sizes: Story = {
	render: () => (
		<List aria-label="Sizes" className="max-w-md">
			<ListItem variant="outline">
				<ItemContent>
					<ItemTitle>Default size</ItemTitle>
				</ItemContent>
			</ListItem>
			<ListItem variant="outline" size="sm">
				<ItemContent>
					<ItemTitle>Small size</ItemTitle>
				</ItemContent>
			</ListItem>
			<ListItem variant="outline" size="xs">
				<ItemContent>
					<ItemTitle>Extra small size</ItemTitle>
				</ItemContent>
			</ListItem>
		</List>
	),
};

export const Muted: Story = {
	render: () => (
		<List aria-label="Bookings" className="max-w-md">
			<ListItem variant="muted">
				<ItemContent>
					<ItemTitle>Booking confirmed</ItemTitle>
					<ItemDescription>FC Lyon — June 14</ItemDescription>
				</ItemContent>
			</ListItem>
			<ListItem variant="muted">
				<ItemContent>
					<ItemTitle>Awaiting report</ItemTitle>
					<ItemDescription>Handball club — June 7</ItemDescription>
				</ItemContent>
			</ListItem>
		</List>
	),
};

/**
 * The whole point of List over ItemGroup: assistive technology sees a real
 * list. The play function asserts the roles and that the separator is not
 * counted as an item.
 */
export const Accessibility: Story = {
	render: () => (
		<List aria-label="Missions">
			<ListItem>First mission</ListItem>
			<ListSeparator />
			<ListItem>Second mission</ListItem>
		</List>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const list = canvas.getByRole("list", { name: "Missions" });
		expect(list.tagName).toBe("UL");
		expect(canvas.getAllByRole("listitem")).toHaveLength(2);
	},
};
