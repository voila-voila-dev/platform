import { WarningIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { AlertDialog } from "@voila.dev/ui/alert-dialog";
import { Button } from "@voila.dev/ui/button";
import { Spinner } from "@voila.dev/ui/spinner";
import { useState } from "react";

const meta = {
	title: "UI/AlertDialog",
	component: AlertDialog.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof AlertDialog.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<AlertDialog.Root>
			<AlertDialog.Trigger render={<Button variant="outline" />}>
				Cancel project
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Cancel this project?</AlertDialog.Title>
					<AlertDialog.Description>
						The freelancer will be notified and the booking will be released.
						This action cannot be undone.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Keep project</AlertDialog.Cancel>
					<AlertDialog.Action variant="destructive">
						Cancel project
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	),
};

export const WithMedia: Story = {
	render: () => (
		<AlertDialog.Root>
			<AlertDialog.Trigger render={<Button variant="destructive" />}>
				Remove freelancer
			</AlertDialog.Trigger>
			<AlertDialog.Content size="sm">
				<AlertDialog.Header>
					<AlertDialog.Media>
						<WarningIcon className="text-destructive" />
					</AlertDialog.Media>
					<AlertDialog.Title>Remove this freelancer?</AlertDialog.Title>
					<AlertDialog.Description>
						Camille Dubois will lose access to all upcoming projects for your
						team.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action variant="destructive">Remove</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	),
};

export const DefaultOpen: Story = {
	render: () => (
		<AlertDialog.Root defaultOpen>
			<AlertDialog.Trigger render={<Button variant="outline" />}>
				Cancel project
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Cancel this project?</AlertDialog.Title>
					<AlertDialog.Description>
						The freelancer will be notified and the booking will be released.
						This action cannot be undone.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Keep project</AlertDialog.Cancel>
					<AlertDialog.Action variant="destructive">
						Cancel project
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	),
};

export const SmallWithoutMedia: Story = {
	render: () => (
		<AlertDialog.Root>
			<AlertDialog.Trigger render={<Button variant="outline" />}>
				Decline application
			</AlertDialog.Trigger>
			<AlertDialog.Content size="sm">
				<AlertDialog.Header>
					<AlertDialog.Title>Decline this application?</AlertDialog.Title>
					<AlertDialog.Description>
						The freelancer will be notified that their application was declined.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action variant="destructive">Decline</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	),
};

export const LongDescription: Story = {
	render: () => (
		<AlertDialog.Root>
			<AlertDialog.Trigger render={<Button variant="outline" />}>
				Delete workspace
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Delete this workspace?</AlertDialog.Title>
					<AlertDialog.Description>
						Deleting your workspace is permanent and cannot be undone. All
						projects, bookings, and applications associated with this workspace
						will be cancelled. Every freelancer with upcoming projects will be
						notified and their bookings released. Pending invoices will still be
						collected, and your billing history will remain available to our
						support team for legal retention purposes. Members of your workspace
						will immediately lose access to the dashboard, and any scheduled
						milestones will be removed from their calendars. If you only want to
						pause activity, consider archiving the workspace instead — archiving
						keeps your data and can be reversed at any time by contacting
						support.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Keep workspace</AlertDialog.Cancel>
					<AlertDialog.Action variant="destructive">Delete</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	),
};

function AsyncActionAlertDialog() {
	const [open, setOpen] = useState(false);
	const [pending, setPending] = useState(false);
	return (
		<AlertDialog.Root
			open={open}
			onOpenChange={(nextOpen) => {
				if (!pending) {
					setOpen(nextOpen);
				}
			}}
		>
			<AlertDialog.Trigger render={<Button variant="outline" />}>
				Archive project
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Archive this project?</AlertDialog.Title>
					<AlertDialog.Description>
						The project will be hidden from the active list. You can restore it
						from the archive at any time.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel disabled={pending}>Cancel</AlertDialog.Cancel>
					<Button
						variant="destructive"
						disabled={pending}
						onClick={async () => {
							setPending(true);
							await new Promise((resolve) => setTimeout(resolve, 1500));
							setPending(false);
							setOpen(false);
						}}
					>
						{pending ? <Spinner /> : null}
						{pending ? "Archiving…" : "Archive"}
					</Button>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
}

export const AsyncAction: Story = {
	render: () => <AsyncActionAlertDialog />,
};
