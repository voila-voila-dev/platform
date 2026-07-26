import {
	CalendarCheckIcon,
	PaletteIcon,
	UserCircleIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { Item } from "@voila.dev/ui/item";
import { List } from "@voila.dev/ui/list";
import { expect, within } from "storybook/test";

const meta = {
	title: "UI/List",
	component: List.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof List.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<List.Root aria-label="Open projects" className="max-w-md">
			<List.Item variant="outline">
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
			</List.Item>
			<List.Item variant="outline">
				<Item.Media variant="icon">
					<PaletteIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>Launch week support</Item.Title>
					<Item.Description>
						Two developers for the launch week push, June 21, full day.
					</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Button size="sm" variant="outline">
						Apply
					</Button>
				</Item.Actions>
			</List.Item>
		</List.Root>
	),
};

export const WithSeparator: Story = {
	render: () => (
		<List.Root aria-label="Freelancers" className="max-w-md gap-0">
			<List.Item>
				<Item.Media variant="icon">
					<UserCircleIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>Nina Dupont</Item.Title>
					<Item.Description>Product designer — Lyon</Item.Description>
				</Item.Content>
			</List.Item>
			<List.Separator />
			<List.Item>
				<Item.Media variant="icon">
					<UserCircleIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>Paul Martin</Item.Title>
					<Item.Description>Copywriter — Villeurbanne</Item.Description>
				</Item.Content>
			</List.Item>
		</List.Root>
	),
};

export const Sizes: Story = {
	render: () => (
		<List.Root aria-label="Sizes" className="max-w-md">
			<List.Item variant="outline">
				<Item.Content>
					<Item.Title>Default size</Item.Title>
				</Item.Content>
			</List.Item>
			<List.Item variant="outline" size="sm">
				<Item.Content>
					<Item.Title>Small size</Item.Title>
				</Item.Content>
			</List.Item>
			<List.Item variant="outline" size="xs">
				<Item.Content>
					<Item.Title>Extra small size</Item.Title>
				</Item.Content>
			</List.Item>
		</List.Root>
	),
};

export const Muted: Story = {
	render: () => (
		<List.Root aria-label="Bookings" className="max-w-md">
			<List.Item variant="muted">
				<Item.Content>
					<Item.Title>Booking confirmed</Item.Title>
					<Item.Description>Northwind — June 14</Item.Description>
				</Item.Content>
			</List.Item>
			<List.Item variant="muted">
				<Item.Content>
					<Item.Title>Awaiting report</Item.Title>
					<Item.Description>Brightloop — June 7</Item.Description>
				</Item.Content>
			</List.Item>
		</List.Root>
	),
};

/**
 * The whole point of List over Item.Group: assistive technology sees a real
 * list. The play function asserts the roles and that the separator is not
 * counted as an item.
 */
export const Accessibility: Story = {
	render: () => (
		<List.Root aria-label="Projects">
			<List.Item>First project</List.Item>
			<List.Separator />
			<List.Item>Second project</List.Item>
		</List.Root>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const list = canvas.getByRole("list", { name: "Projects" });
		expect(list.tagName).toBe("UL");
		expect(canvas.getAllByRole("listitem")).toHaveLength(2);
	},
};
