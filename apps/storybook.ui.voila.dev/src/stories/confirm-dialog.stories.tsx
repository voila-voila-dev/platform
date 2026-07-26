import { WarningIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { ConfirmDialog } from "@voila.dev/ui/confirm-dialog";
import { toast } from "@voila.dev/ui/sonner";
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
			trigger={<Button variant="outline">Publish project</Button>}
			title="Publish this project?"
			description="Freelancers matching the required skills will be notified and can start applying."
			confirmLabel="Publish"
		/>
	),
};

export const Destructive: Story = {
	render: () => (
		<ConfirmDialog
			trigger={<Button variant="destructive">Remove freelancer</Button>}
			size="sm"
			media={<WarningIcon className="text-destructive" />}
			title="Remove this freelancer?"
			description="Camille Dubois will lose access to all upcoming projects for your team."
			confirmLabel="Remove"
			variant="destructive"
		/>
	),
};

export const CustomLabels: Story = {
	render: () => (
		<ConfirmDialog
			trigger={<Button variant="outline">Cancel the project</Button>}
			title="Cancel this project?"
			description="The freelancer will be notified and the booking will be released. This action is irreversible."
			confirmLabel="Cancel the project"
			cancelLabel="Go back"
			variant="destructive"
		/>
	),
};

export const AsyncAction: Story = {
	render: () => (
		<ConfirmDialog
			trigger={<Button variant="outline">Archive project</Button>}
			title="Archive this project?"
			description="The project will be hidden from the active list. You can restore it from the archive at any time."
			confirmLabel="Archive"
			onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1500))}
		/>
	),
};

function FailingAsyncConfirmDialog() {
	return (
		<ConfirmDialog
			trigger={<Button variant="destructive">Delete workspace</Button>}
			title="Delete this workspace?"
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
				description="The freelancer will be notified that their application was declined."
				confirmLabel="Decline"
				variant="destructive"
			/>
		</>
	);
}

export const Controlled: Story = {
	render: () => <ControlledConfirmDialog />,
};
