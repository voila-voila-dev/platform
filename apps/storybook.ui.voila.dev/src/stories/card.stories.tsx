import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Badge } from "@voila.dev/ui/components/badge";
import { Button } from "@voila.dev/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@voila.dev/ui/components/card";

// Inline SVG so the image-topped story renders offline (and is a real <img>,
// which the card's `has-[>img:first-child]` / image-rounding selectors need).
const coverImage = `data:image/svg+xml;utf8,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="384" height="160"><rect width="384" height="160" fill="#1f6feb"/><text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="20" text-anchor="middle" dy=".3em">Match day</text></svg>',
)}`;

const meta = {
	title: "UI/Card",
	component: Card,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["default", "sm"],
		},
	},
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Card className="w-96">
			<CardHeader>
				<CardTitle>Physiotherapist — Match day</CardTitle>
				<CardDescription>
					Racing Club de Lyon · Saturday, June 20
				</CardDescription>
				<CardAction>
					<Badge>Open</Badge>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p>
					Pitch-side coverage for the senior rugby team, including warm-up
					supervision and injury assessment.
				</p>
			</CardContent>
			<CardFooter className="justify-end gap-2">
				<Button variant="outline" size="sm">
					View details
				</Button>
				<Button size="sm">Apply</Button>
			</CardFooter>
		</Card>
	),
};

export const Small: Story = {
	render: () => (
		<Card size="sm" className="w-80">
			<CardHeader>
				<CardTitle>Mission report</CardTitle>
				<CardDescription>Submitted 2 hours ago</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Two minor injuries treated, no follow-up required.</p>
			</CardContent>
		</Card>
	),
};

/** Exercises a small card *with* a footer (`data-[size=sm]:has-data-[slot=card-footer]:pb-0`). */
export const SmallWithFooter: Story = {
	render: () => (
		<Card size="sm" className="w-80">
			<CardHeader>
				<CardTitle>Mission report</CardTitle>
				<CardDescription>Submitted 2 hours ago</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Two minor injuries treated, no follow-up required.</p>
			</CardContent>
			<CardFooter className="justify-end gap-2">
				<Button size="sm">Acknowledge</Button>
			</CardFooter>
		</Card>
	),
};

/**
 * Image as the first child — exercises `has-[>img:first-child]:pt-0` and the
 * `*:[img:first-child]:rounded-t-xl` top-corner rounding, untested before.
 */
export const ImageTopped: Story = {
	render: () => (
		<Card className="w-96">
			<img src={coverImage} alt="Match day cover" />
			<CardHeader>
				<CardTitle>Match day coverage</CardTitle>
				<CardDescription>Racing Club de Lyon</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Senior rugby fixture — pitch-side physiotherapy required.</p>
			</CardContent>
		</Card>
	),
};

/** Exercises the `CardHeader` opt-in bottom border (`[.border-b]:pb-4`). */
export const HeaderWithBorder: Story = {
	render: () => (
		<Card className="w-96">
			<CardHeader className="border-b">
				<CardTitle>Physiotherapist — Match day</CardTitle>
				<CardDescription>Racing Club de Lyon</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Pitch-side coverage for the senior rugby team.</p>
			</CardContent>
		</Card>
	),
};

/** Footer used as a left-aligned metadata row rather than an action bar. */
export const FooterMetadata: Story = {
	render: () => (
		<Card className="w-96">
			<CardHeader>
				<CardTitle>Mission report</CardTitle>
			</CardHeader>
			<CardContent>
				<p>Two minor injuries treated, no follow-up required.</p>
			</CardContent>
			<CardFooter className="gap-2 text-muted-foreground">
				<Badge variant="secondary">Closed</Badge>
				<span className="text-sm">Updated 2 hours ago</span>
			</CardFooter>
		</Card>
	),
};

/**
 * Demonstrates the `render` prop: `CardTitle` becomes a real `<h2>` for the
 * document outline without a wrapper, and the card root becomes an `<article>`.
 */
export const SemanticHeading: Story = {
	render: () => (
		<Card render={<article />} className="w-96">
			<CardHeader>
				<CardTitle render={<h2>Physiotherapist — Match day</h2>} />
				<CardDescription>Racing Club de Lyon</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Pitch-side coverage for the senior rugby team.</p>
			</CardContent>
		</Card>
	),
};
