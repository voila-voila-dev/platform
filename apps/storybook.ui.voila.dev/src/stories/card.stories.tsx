import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Badge } from "@voila.dev/ui/badge";
import { Button } from "@voila.dev/ui/button";
import { Card } from "@voila.dev/ui/card";

// Inline SVG so the image-topped story renders offline (and is a real <img>,
// which the card's `has-[>img:first-child]` / image-rounding selectors need).
const coverImage = `data:image/svg+xml;utf8,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="384" height="160"><rect width="384" height="160" fill="#7c3aed"/><text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="20" text-anchor="middle" dy=".3em">Site launch</text></svg>',
)}`;

const meta = {
	title: "UI/Card",
	component: Card.Root,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["default", "sm"],
		},
	},
} satisfies Meta<typeof Card.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Card.Root className="w-96">
			<Card.Header>
				<Card.Title>Brand designer — Site launch</Card.Title>
				<Card.Description>
					Northwind Studio · Due Saturday, June 20
				</Card.Description>
				<Card.Action>
					<Badge>Open</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Content>
				<p>
					Design support for the marketing site launch, including landing page
					layouts and asset handoff.
				</p>
			</Card.Content>
			<Card.Footer className="justify-end gap-2">
				<Button variant="outline" size="sm">
					View details
				</Button>
				<Button size="sm">Apply</Button>
			</Card.Footer>
		</Card.Root>
	),
};

export const Small: Story = {
	render: () => (
		<Card.Root size="sm" className="w-80">
			<Card.Header>
				<Card.Title>Project report</Card.Title>
				<Card.Description>Submitted 2 hours ago</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>Two revision rounds delivered, no follow-up required.</p>
			</Card.Content>
		</Card.Root>
	),
};

/** Exercises a small card *with* a footer (`data-[size=sm]:has-data-[slot=card-footer]:pb-0`). */
export const SmallWithFooter: Story = {
	render: () => (
		<Card.Root size="sm" className="w-80">
			<Card.Header>
				<Card.Title>Project report</Card.Title>
				<Card.Description>Submitted 2 hours ago</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>Two revision rounds delivered, no follow-up required.</p>
			</Card.Content>
			<Card.Footer className="justify-end gap-2">
				<Button size="sm">Acknowledge</Button>
			</Card.Footer>
		</Card.Root>
	),
};

/**
 * Image as the first child — exercises `has-[>img:first-child]:pt-0` and the
 * `*:[img:first-child]:rounded-t-xl` top-corner rounding, untested before.
 */
export const ImageTopped: Story = {
	render: () => (
		<Card.Root className="w-96">
			<img src={coverImage} alt="Site launch cover" />
			<Card.Header>
				<Card.Title>Site launch design</Card.Title>
				<Card.Description>Northwind Studio</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>Marketing site relaunch — senior brand designer required.</p>
			</Card.Content>
		</Card.Root>
	),
};

/** Exercises the `Card.Header` opt-in bottom border (`[.border-b]:pb-4`). */
export const HeaderWithBorder: Story = {
	render: () => (
		<Card.Root className="w-96">
			<Card.Header className="border-b">
				<Card.Title>Brand designer — Site launch</Card.Title>
				<Card.Description>Northwind Studio</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>Design support for the marketing site launch.</p>
			</Card.Content>
		</Card.Root>
	),
};

/** Footer used as a left-aligned metadata row rather than an action bar. */
export const FooterMetadata: Story = {
	render: () => (
		<Card.Root className="w-96">
			<Card.Header>
				<Card.Title>Project report</Card.Title>
			</Card.Header>
			<Card.Content>
				<p>Two revision rounds delivered, no follow-up required.</p>
			</Card.Content>
			<Card.Footer className="gap-2 text-muted-foreground">
				<Badge variant="secondary">Closed</Badge>
				<span className="text-sm">Updated 2 hours ago</span>
			</Card.Footer>
		</Card.Root>
	),
};

/**
 * Demonstrates the `render` prop: `Card.Title` becomes a real `<h2>` for the
 * document outline without a wrapper, and the card root becomes an `<article>`.
 */
export const SemanticHeading: Story = {
	render: () => (
		<Card.Root render={<article />} className="w-96">
			<Card.Header>
				<Card.Title render={<h2>Brand designer — Site launch</h2>} />
				<Card.Description>Northwind Studio</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>Design support for the marketing site launch.</p>
			</Card.Content>
		</Card.Root>
	),
};
