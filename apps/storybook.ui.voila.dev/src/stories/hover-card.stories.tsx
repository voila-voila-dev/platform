import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@voila.dev/ui/components/avatar";
import { Button } from "@voila.dev/ui/components/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@voila.dev/ui/components/hover-card";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/HoverCard",
	component: HoverCard,
	tags: ["autodocs"],
} satisfies Meta<typeof HoverCard>;

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
		<HoverCard>
			<HoverCardTrigger render={<Button variant="link" />}>
				@nathan.guyot
			</HoverCardTrigger>
			<HoverCardContent>
				<FreelancerPreview />
			</HoverCardContent>
		</HoverCard>
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
		<HoverCard defaultOpen>
			<HoverCardTrigger render={<Button variant="link" />}>
				@nathan.guyot
			</HoverCardTrigger>
			<HoverCardContent side="right">
				<FreelancerPreview />
			</HoverCardContent>
		</HoverCard>
	),
};

/** The dominant real usage: a plain inline link as the trigger. */
export const InlineLink: Story = {
	render: () => (
		<p className="max-w-md text-sm">
			The project was accepted by{" "}
			<HoverCard defaultOpen>
				<HoverCardTrigger
					render={
						<a href="#freelancer-profile" className="underline">
							Nathan Guyot
						</a>
					}
				/>
				<HoverCardContent>
					<FreelancerPreview />
				</HoverCardContent>
			</HoverCard>{" "}
			within an hour of publication.
		</p>
	),
};

/** The canonical preview: avatar, identity and a row of stats. */
export const RichContent: Story = {
	render: () => (
		<HoverCard defaultOpen>
			<HoverCardTrigger render={<Button variant="link" />}>
				@nathan.guyot
			</HoverCardTrigger>
			<HoverCardContent>
				<div className="flex flex-col gap-2.5">
					<div className="flex items-center gap-2.5">
						<Avatar>
							<AvatarImage src="https://i.pravatar.cc/64?img=12" alt="" />
							<AvatarFallback>NG</AvatarFallback>
						</Avatar>
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
			</HoverCardContent>
		</HoverCard>
	),
};

const ControlledExample = () => {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex flex-col items-start gap-4">
			<Button variant="outline" onClick={() => setOpen((value) => !value)}>
				{open ? "Close" : "Open"} the preview
			</Button>
			<HoverCard open={open} onOpenChange={setOpen}>
				<HoverCardTrigger render={<Button variant="link" />}>
					@nathan.guyot
				</HoverCardTrigger>
				<HoverCardContent>
					<FreelancerPreview />
				</HoverCardContent>
			</HoverCard>
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
		<HoverCard>
			<HoverCardTrigger
				delay={100}
				closeDelay={100}
				render={<Button variant="link" />}
			>
				@nathan.guyot
			</HoverCardTrigger>
			<HoverCardContent>
				<FreelancerPreview />
			</HoverCardContent>
		</HoverCard>
	),
};
