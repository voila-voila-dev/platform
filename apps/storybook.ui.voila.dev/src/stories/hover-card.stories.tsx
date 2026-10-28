import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Avatar } from "@voila.dev/ui/avatar";
import { Button } from "@voila.dev/ui/button";
import { HoverCard } from "@voila.dev/ui/hover-card";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/HoverCard",
	component: HoverCard.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof HoverCard.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const FreelancerPreview = () => (
	<div className="flex flex-col gap-1">
		<p className="font-medium">Nathan Guyot</p>
		<p className="text-muted-foreground">
			Product designer — takes on brand and web design projects for early-stage
			teams.
		</p>
		<p className="text-muted-foreground text-xs">Joined March 2026</p>
	</div>
);

export const Default: Story = {
	render: () => (
		<HoverCard.Root>
			<HoverCard.Trigger render={<Button variant="link" />}>
				@nathan.guyot
			</HoverCard.Trigger>
			<HoverCard.Content>
				<FreelancerPreview />
			</HoverCard.Content>
		</HoverCard.Root>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.hover(canvas.getByText("@nathan.guyot"));
		// The card portals to the body and opens after the 600ms trigger delay.
		await waitFor(
			() => {
				const card = document.querySelector("[data-slot=hover-card-content]");
				expect(card).not.toBeNull();
			},
			{ timeout: 2000 },
		);
	},
};

export const DefaultOpen: Story = {
	render: () => (
		<HoverCard.Root defaultOpen>
			<HoverCard.Trigger render={<Button variant="link" />}>
				@nathan.guyot
			</HoverCard.Trigger>
			<HoverCard.Content side="right">
				<FreelancerPreview />
			</HoverCard.Content>
		</HoverCard.Root>
	),
};

/** The dominant real usage: a plain inline link as the trigger. */
export const InlineLink: Story = {
	render: () => (
		<p className="max-w-md text-sm">
			The project was accepted by{" "}
			<HoverCard.Root defaultOpen>
				<HoverCard.Trigger
					render={
						<a href="#freelancer-profile" className="underline">
							Nathan Guyot
						</a>
					}
				/>
				<HoverCard.Content>
					<FreelancerPreview />
				</HoverCard.Content>
			</HoverCard.Root>{" "}
			within an hour of publication.
		</p>
	),
};

/** The canonical preview: avatar, identity and a row of stats. */
export const RichContent: Story = {
	render: () => (
		<HoverCard.Root defaultOpen>
			<HoverCard.Trigger render={<Button variant="link" />}>
				@nathan.guyot
			</HoverCard.Trigger>
			<HoverCard.Content>
				<div className="flex flex-col gap-2.5">
					<div className="flex items-center gap-2.5">
						<Avatar.Root>
							<Avatar.Image src="https://i.pravatar.cc/64?img=12" alt="" />
							<Avatar.Fallback>NG</Avatar.Fallback>
						</Avatar.Root>
						<div className="flex flex-col">
							<p className="font-medium">Nathan Guyot</p>
							<p className="text-muted-foreground text-xs">
								Product designer · Rotterdam
							</p>
						</div>
					</div>
					<div className="flex gap-3 text-xs">
						<span>
							<span className="font-medium">42</span>{" "}
							<span className="text-muted-foreground">projects</span>
						</span>
						<span>
							<span className="font-medium">4.9</span>{" "}
							<span className="text-muted-foreground">rating</span>
						</span>
						<span>
							<span className="font-medium">98%</span>{" "}
							<span className="text-muted-foreground">reliability</span>
						</span>
					</div>
				</div>
			</HoverCard.Content>
		</HoverCard.Root>
	),
};

const ControlledExample = () => {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex flex-col items-start gap-4">
			<Button variant="outline" onClick={() => setOpen((value) => !value)}>
				{open ? "Close" : "Open"} the preview
			</Button>
			<HoverCard.Root open={open} onOpenChange={setOpen}>
				<HoverCard.Trigger render={<Button variant="link" />}>
					@nathan.guyot
				</HoverCard.Trigger>
				<HoverCard.Content>
					<FreelancerPreview />
				</HoverCard.Content>
			</HoverCard.Root>
		</div>
	);
};

export const Controlled: Story = {
	render: () => <ControlledExample />,
};

/**
 * `delay`/`closeDelay` are tuned on the trigger (Base UI defaults: 600ms open,
 * 300ms close). This one opens almost immediately.
 */
export const FastDelay: Story = {
	render: () => (
		<HoverCard.Root>
			<HoverCard.Trigger
				delay={100}
				closeDelay={100}
				render={<Button variant="link" />}
			>
				@nathan.guyot
			</HoverCard.Trigger>
			<HoverCard.Content>
				<FreelancerPreview />
			</HoverCard.Content>
		</HoverCard.Root>
	),
};
