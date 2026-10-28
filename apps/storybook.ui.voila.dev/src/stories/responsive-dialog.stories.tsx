import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { ResponsiveDialog } from "@voila.dev/ui/responsive-dialog";

const meta = {
	title: "UI/ResponsiveDialog",
	component: ResponsiveDialog.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof ResponsiveDialog.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ResponsiveDialog.Root>
			<ResponsiveDialog.Trigger render={<Button variant="outline" />}>
				Invite a freelancer
			</ResponsiveDialog.Trigger>
			<ResponsiveDialog.Content>
				<ResponsiveDialog.Header>
					<ResponsiveDialog.Title>Invite a freelancer</ResponsiveDialog.Title>
					<ResponsiveDialog.Description>
						Send an invitation to a freelancer so they can apply to your team's
						projects. Resize the viewport below 768px to get the bottom drawer.
					</ResponsiveDialog.Description>
				</ResponsiveDialog.Header>
				<ResponsiveDialog.Footer closeLabel="Cancel">
					<Button>Send invitation</Button>
				</ResponsiveDialog.Footer>
			</ResponsiveDialog.Content>
		</ResponsiveDialog.Root>
	),
};

export const WithBody: Story = {
	render: () => (
		<ResponsiveDialog.Root>
			<ResponsiveDialog.Trigger render={<Button variant="outline" />}>
				Cancel project
			</ResponsiveDialog.Trigger>
			<ResponsiveDialog.Content>
				<ResponsiveDialog.Header>
					<ResponsiveDialog.Title>Cancel this project?</ResponsiveDialog.Title>
					<ResponsiveDialog.Description>
						The assigned freelancer will be notified immediately.
					</ResponsiveDialog.Description>
				</ResponsiveDialog.Header>
				<ResponsiveDialog.Body>
					<p>
						Refunds follow the escrow cancellation policy: the held payment is
						returned to the client's wallet once the cancellation is confirmed.
					</p>
				</ResponsiveDialog.Body>
				<ResponsiveDialog.Footer>
					<ResponsiveDialog.Close render={<Button variant="outline" />}>
						Keep project
					</ResponsiveDialog.Close>
					<Button variant="destructive">Cancel project</Button>
				</ResponsiveDialog.Footer>
			</ResponsiveDialog.Content>
		</ResponsiveDialog.Root>
	),
};
