import {
	CalendarCheckIcon,
	PaletteIcon,
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
		<List aria-label="Open projects" className="max-w-md">
			<ListItem variant="outline">
				<ItemMedia variant="icon">
					<CalendarCheckIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Landing page redesign</ItemTitle>
					<ItemDescription>
						Designer needed for a marketing site refresh, kickoff June 14, about
						two weeks of work.
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
					<PaletteIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Launch week support</ItemTitle>
					<ItemDescription>
						Two developers for the launch week push, June 21, full day.
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
		<List aria-label="Freelancers" className="max-w-md gap-0">
			<ListItem>
				<ItemMedia variant="icon">
					<UserCircleIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Nina Dupont</ItemTitle>
					<ItemDescription>Product designer — Lyon</ItemDescription>
				</ItemContent>
			</ListItem>
			<ListSeparator />
			<ListItem>
				<ItemMedia variant="icon">
					<UserCircleIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Paul Martin</ItemTitle>
					<ItemDescription>Copywriter — Villeurbanne</ItemDescription>
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
					<ItemDescription>Northwind — June 14</ItemDescription>
				</ItemContent>
			</ListItem>
			<ListItem variant="muted">
				<ItemContent>
					<ItemTitle>Awaiting report</ItemTitle>
					<ItemDescription>Brightloop — June 7</ItemDescription>
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
		<List aria-label="Projects">
			<ListItem>First project</ListItem>
			<ListSeparator />
			<ListItem>Second project</ListItem>
		</List>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const list = canvas.getByRole("list", { name: "Projects" });
		expect(list.tagName).toBe("UL");
		expect(canvas.getAllByRole("listitem")).toHaveLength(2);
	},
};
