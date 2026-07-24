import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { Kbd } from "@voila.dev/ui/components/kbd";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@voila.dev/ui/components/tooltip";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/Tooltip",
	component: Tooltip,
	tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tooltip>
			<TooltipTrigger render={<Button variant="outline" />}>
				Hover me
			</TooltipTrigger>
			<TooltipContent>Invite this freelancer to your project</TooltipContent>
		</Tooltip>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.hover(canvas.getByRole("button", { name: "Hover me" }));
		await waitFor(() =>
			expect(
				document.querySelector("[data-slot=tooltip-content]"),
			).toBeInTheDocument(),
		);
	},
};

export const Sides: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			{(["top", "right", "bottom", "left"] as const).map((side) => (
				<Tooltip key={side}>
					<TooltipTrigger render={<Button variant="outline" />}>
						{side}
					</TooltipTrigger>
					<TooltipContent side={side}>
						Tooltip on the {side} side
					</TooltipContent>
				</Tooltip>
			))}
		</div>
	),
};

export const DefaultOpen: Story = {
	render: () => (
		<Tooltip defaultOpen>
			<TooltipTrigger render={<Button variant="outline" />}>
				Project status
			</TooltipTrigger>
			<TooltipContent>Awaiting freelancer confirmation</TooltipContent>
		</Tooltip>
	),
};

export const WithKbd: Story = {
	render: () => (
		<Tooltip defaultOpen>
			<TooltipTrigger render={<Button variant="outline" />}>
				Save report
			</TooltipTrigger>
			<TooltipContent>
				Save the project report
				<Kbd>⌘S</Kbd>
			</TooltipContent>
		</Tooltip>
	),
};

export const LongContent: Story = {
	render: () => (
		<Tooltip defaultOpen>
			<TooltipTrigger render={<Button variant="outline" />}>
				Payment policy
			</TooltipTrigger>
			<TooltipContent>
				Once the freelancer accepts, the project amount is held in escrow and
				released 48 hours after the final deliverable is submitted, unless the
				client opens a dispute.
			</TooltipContent>
		</Tooltip>
	),
};

/**
 * The kit defaults to instant tooltips (`delay={0}`); pass `delay` on the
 * `Tooltip` itself to restore a hover-intent pause.
 */
export const WithDelay: Story = {
	render: () => (
		<Tooltip delay={700}>
			<TooltipTrigger render={<Button variant="outline" />}>
				Slow tooltip (700ms)
			</TooltipTrigger>
			<TooltipContent>Opens after a hover-intent pause</TooltipContent>
		</Tooltip>
	),
};
