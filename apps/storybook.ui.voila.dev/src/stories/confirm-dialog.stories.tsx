import { WarningIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { ConfirmDialog } from "@voila.dev/ui/components/confirm-dialog";
import { toast } from "@voila.dev/ui/components/sonner";
import { useState } from "react";

const meta = {
	title: "UI/ConfirmDialog",
	component: ConfirmDialog,
	tags: ["autodocs"],
	args: {
		title: "",
	},
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ConfirmDialog
			trigger={<Button variant="outline">Publish mission</Button>}
			title="Publish this mission?"
			description="Providers matching the required skills will be notified and can start applying."
			confirmLabel="Publish"
		/>
	),
};

export const Destructive: Story = {
	render: () => (
		<ConfirmDialog
			trigger={<Button variant="destructive">Remove provider</Button>}
			size="sm"
			media={<WarningIcon className="text-destructive" />}
			title="Remove this provider?"
			description="Camille Dubois will lose access to all upcoming missions for your club."
			confirmLabel="Remove"
			variant="destructive"
		/>
	),
};

export const LocalizedLabels: Story = {
	render: () => (
		<ConfirmDialog
			trigger={<Button variant="outline">Annuler la mission</Button>}
			title="Annuler cette mission ?"
			description="Le professionnel sera notifié et la réservation sera libérée. Cette action est irréversible."
			confirmLabel="Annuler la mission"
			cancelLabel="Retour"
			variant="destructive"
		/>
	),
};

export const AsyncAction: Story = {
	render: () => (
		<ConfirmDialog
			trigger={<Button variant="outline">Archive mission</Button>}
			title="Archive this mission?"
			description="The mission will be hidden from the active list. You can restore it from the archive at any time."
			confirmLabel="Archive"
			onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1500))}
		/>
	),
};

function FailingAsyncConfirmDialog() {
	return (
		<ConfirmDialog
			trigger={<Button variant="destructive">Delete organization</Button>}
			title="Delete this organization?"
			description="This async action always fails after a second — the dialog stays open so the user can retry."
			confirmLabel="Delete"
			variant="destructive"
			onConfirm={() =>
				new Promise((_resolve, reject) =>
					setTimeout(() => {
						toast.error("Something went wrong. Please try again.");
						reject(new Error("simulated failure"));
					}, 1000),
				)
			}
		/>
	);
}

export const AsyncFailure: Story = {
	render: () => <FailingAsyncConfirmDialog />,
};

function ControlledConfirmDialog() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="outline" onClick={() => setOpen(true)}>
				Open from outside
			</Button>
			<ConfirmDialog
				open={open}
				onOpenChange={setOpen}
				title="Decline this application?"
				description="The provider will be notified that their application was declined."
				confirmLabel="Decline"
				variant="destructive"
			/>
		</>
	);
}

export const Controlled: Story = {
	render: () => <ControlledConfirmDialog />,
};
