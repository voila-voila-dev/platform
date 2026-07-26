import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { Dialog } from "@voila.dev/ui/dialog";

const meta = {
	title: "UI/Dialog",
	component: Dialog.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Dialog.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Dialog.Root>
			<Dialog.Trigger render={<Button variant="outline" />}>
				Invite a freelancer
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Invite a freelancer</Dialog.Title>
					<Dialog.Description>
						Send an invitation to a freelancer so they can apply to your team's
						projects.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Dialog.Close render={<Button variant="outline" />}>
						Cancel
					</Dialog.Close>
					<Button>Send invitation</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	),
};

export const DefaultOpen: Story = {
	render: () => (
		<Dialog.Root defaultOpen>
			<Dialog.Trigger render={<Button variant="outline" />}>
				Cancel project
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Cancel this project?</Dialog.Title>
					<Dialog.Description>
						The assigned freelancer will be notified immediately. This action
						cannot be undone.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Dialog.Close render={<Button variant="outline" />}>
						Keep project
					</Dialog.Close>
					<Button variant="destructive">Cancel project</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	),
};

export const WithoutCloseButton: Story = {
	render: () => (
		<Dialog.Root>
			<Dialog.Trigger render={<Button variant="outline" />}>
				Open dialog
			</Dialog.Trigger>
			<Dialog.Content showCloseButton={false}>
				<Dialog.Header>
					<Dialog.Title>Review the report</Dialog.Title>
					<Dialog.Description>
						Confirm the project report before releasing the payment.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer closeLabel="Close">
					<Button>Confirm</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			{(["sm", "default", "lg", "xl"] as const).map((size) => (
				<Dialog.Root key={size}>
					<Dialog.Trigger render={<Button variant="outline" />}>
						{size}
					</Dialog.Trigger>
					<Dialog.Content size={size}>
						<Dialog.Header>
							<Dialog.Title>Project details</Dialog.Title>
							<Dialog.Description>
								This dialog uses the {size} size.
							</Dialog.Description>
						</Dialog.Header>
					</Dialog.Content>
				</Dialog.Root>
			))}
		</div>
	),
};

export const LongContent: Story = {
	render: () => (
		<Dialog.Root>
			<Dialog.Trigger render={<Button variant="outline" />}>
				Open terms
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Terms of service</Dialog.Title>
					<Dialog.Description>
						Read the full terms before accepting the project.
					</Dialog.Description>
				</Dialog.Header>
				<div className="grid gap-2">
					{Array.from({ length: 30 }, (_, index) => (
						<p key={String(index)}>
							Clause {index + 1}: the freelancer commits to delivering the
							agreed work by each milestone date and to carrying valid
							professional liability insurance for the full duration of the
							project.
						</p>
					))}
				</div>
				<Dialog.Footer closeLabel="Decline">
					<Button>Accept</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	),
};
