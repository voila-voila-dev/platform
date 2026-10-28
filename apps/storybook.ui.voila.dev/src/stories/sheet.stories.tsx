import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { Sheet } from "@voila.dev/ui/sheet";

const meta = {
	title: "UI/Sheet",
	component: Sheet.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Sheet.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Sheet.Root>
			<Sheet.Trigger render={<Button variant="outline" />}>
				Open project details
			</Sheet.Trigger>
			<Sheet.Content>
				<Sheet.Header>
					<Sheet.Title>Project details</Sheet.Title>
					<Sheet.Description>
						Landing page redesign for the spring product launch.
					</Sheet.Description>
				</Sheet.Header>
				<div className="grid gap-2 px-4 text-sm">
					<p>Client: Northwind Studio</p>
					<p>Kickoff: Saturday, June 14 - 2:00 PM</p>
					<p>Rate: 45 USD / hour</p>
				</div>
				<Sheet.Footer>
					<Button>Confirm engagement</Button>
					<Sheet.Close render={<Button variant="outline" />}>
						Cancel
					</Sheet.Close>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	),
};

export const Sides: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			{(["top", "right", "bottom", "left"] as const).map((side) => (
				<Sheet.Root key={side}>
					<Sheet.Trigger render={<Button variant="outline" />}>
						{side}
					</Sheet.Trigger>
					<Sheet.Content side={side}>
						<Sheet.Header>
							<Sheet.Title>Project details</Sheet.Title>
							<Sheet.Description>
								This sheet opens from the {side} side.
							</Sheet.Description>
						</Sheet.Header>
					</Sheet.Content>
				</Sheet.Root>
			))}
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			{(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
				<Sheet.Root key={size}>
					<Sheet.Trigger render={<Button variant="outline" />}>
						{size}
					</Sheet.Trigger>
					<Sheet.Content size={size}>
						<Sheet.Header>
							<Sheet.Title>Project details</Sheet.Title>
							<Sheet.Description>
								This right sheet uses the {size} size.
							</Sheet.Description>
						</Sheet.Header>
					</Sheet.Content>
				</Sheet.Root>
			))}
		</div>
	),
};

export const WithoutCloseButton: Story = {
	render: () => (
		<Sheet.Root>
			<Sheet.Trigger render={<Button variant="outline" />}>
				Open without close button
			</Sheet.Trigger>
			<Sheet.Content showCloseButton={false}>
				<Sheet.Header>
					<Sheet.Title>Project details</Sheet.Title>
					<Sheet.Description>
						Dismiss this sheet from the footer action.
					</Sheet.Description>
				</Sheet.Header>
				<Sheet.Footer>
					<Sheet.Close render={<Button variant="outline" />}>Close</Sheet.Close>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	),
};
