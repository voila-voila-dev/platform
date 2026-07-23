import { WarningIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@voila.dev/ui/components/alert-dialog";
import { Button } from "@voila.dev/ui/components/button";
import { Spinner } from "@voila.dev/ui/components/spinner";
import { useState } from "react";

const meta = {
	title: "UI/AlertDialog",
	component: AlertDialog,
	tags: ["autodocs"],
} satisfies Meta<typeof AlertDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger render={<Button variant="outline" />}>
				Cancel mission
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Cancel this mission?</AlertDialogTitle>
					<AlertDialogDescription>
						The provider will be notified and the booking will be released. This
						action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Keep mission</AlertDialogCancel>
					<AlertDialogAction variant="destructive">
						Cancel mission
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

export const WithMedia: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger render={<Button variant="destructive" />}>
				Remove provider
			</AlertDialogTrigger>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogMedia>
						<WarningIcon className="text-destructive" />
					</AlertDialogMedia>
					<AlertDialogTitle>Remove this provider?</AlertDialogTitle>
					<AlertDialogDescription>
						Camille Dubois will lose access to all upcoming missions for your
						club.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction variant="destructive">Remove</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

export const DefaultOpen: Story = {
	render: () => (
		<AlertDialog defaultOpen>
			<AlertDialogTrigger render={<Button variant="outline" />}>
				Cancel mission
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Cancel this mission?</AlertDialogTitle>
					<AlertDialogDescription>
						The provider will be notified and the booking will be released. This
						action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Keep mission</AlertDialogCancel>
					<AlertDialogAction variant="destructive">
						Cancel mission
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

export const SmallWithoutMedia: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger render={<Button variant="outline" />}>
				Decline application
			</AlertDialogTrigger>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogTitle>Decline this application?</AlertDialogTitle>
					<AlertDialogDescription>
						The provider will be notified that their application was declined.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction variant="destructive">Decline</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

export const LongDescription: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger render={<Button variant="outline" />}>
				Delete organization
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete this organization?</AlertDialogTitle>
					<AlertDialogDescription>
						Deleting your organization is permanent and cannot be undone. All
						missions, bookings, and applications associated with this
						organization will be cancelled. Every provider with upcoming
						missions will be notified and their bookings released. Pending
						invoices will still be collected, and your billing history will
						remain available to our support team for legal retention purposes.
						Members of your organization will immediately lose access to the
						dashboard, and any scheduled events will be removed from their
						calendars. If you only want to pause activity, consider archiving
						the organization instead — archiving keeps your data and can be
						reversed at any time by contacting support.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Keep organization</AlertDialogCancel>
					<AlertDialogAction variant="destructive">Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

function AsyncActionAlertDialog() {
	const [open, setOpen] = useState(false);
	const [pending, setPending] = useState(false);
	return (
		<AlertDialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!pending) {
					setOpen(nextOpen);
				}
			}}
		>
			<AlertDialogTrigger render={<Button variant="outline" />}>
				Archive mission
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Archive this mission?</AlertDialogTitle>
					<AlertDialogDescription>
						The mission will be hidden from the active list. You can restore it
						from the archive at any time.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
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
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export const AsyncAction: Story = {
	render: () => <AsyncActionAlertDialog />,
};
