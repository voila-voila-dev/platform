import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { Kbd } from "@voila.dev/ui/kbd";
import { Tooltip } from "@voila.dev/ui/tooltip";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/Tooltip",
	component: Tooltip.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Tooltip.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tooltip.Root>
			<Tooltip.Trigger render={<Button variant="outline" />}>
				Hover me
			</Tooltip.Trigger>
			<Tooltip.Content>Invite this freelancer to your project</Tooltip.Content>
		</Tooltip.Root>
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
				<Tooltip.Root key={side}>
					<Tooltip.Trigger render={<Button variant="outline" />}>
						{side}
					</Tooltip.Trigger>
					<Tooltip.Content side={side}>
						Tooltip on the {side} side
					</Tooltip.Content>
				</Tooltip.Root>
			))}
		</div>
	),
};

export const DefaultOpen: Story = {
	render: () => (
		<Tooltip.Root defaultOpen>
			<Tooltip.Trigger render={<Button variant="outline" />}>
				Project status
			</Tooltip.Trigger>
			<Tooltip.Content>Awaiting freelancer confirmation</Tooltip.Content>
		</Tooltip.Root>
	),
};

export const WithKbd: Story = {
	render: () => (
		<Tooltip.Root defaultOpen>
			<Tooltip.Trigger render={<Button variant="outline" />}>
				Save report
			</Tooltip.Trigger>
			<Tooltip.Content>
				Save the project report
				<Kbd.Root>⌘S</Kbd.Root>
			</Tooltip.Content>
		</Tooltip.Root>
	),
};

export const LongContent: Story = {
	render: () => (
		<Tooltip.Root defaultOpen>
			<Tooltip.Trigger render={<Button variant="outline" />}>
				Payment policy
			</Tooltip.Trigger>
			<Tooltip.Content>
				Once the freelancer accepts, the project amount is held in escrow and
				released 48 hours after the final deliverable is submitted, unless the
				client opens a dispute.
			</Tooltip.Content>
		</Tooltip.Root>
	),
};

/**
 * The kit defaults to instant tooltips (`delay={0}`); pass `delay` on the
 * `Tooltip` itself to restore a hover-intent pause.
 */
export const WithDelay: Story = {
	render: () => (
		<Tooltip.Root delay={700}>
			<Tooltip.Trigger render={<Button variant="outline" />}>
				Slow tooltip (700ms)
			</Tooltip.Trigger>
			<Tooltip.Content>Opens after a hover-intent pause</Tooltip.Content>
		</Tooltip.Root>
	),
};
