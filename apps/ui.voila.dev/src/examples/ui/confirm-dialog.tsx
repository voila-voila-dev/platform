import { Button } from "@voila.dev/ui/button";
import { ConfirmDialog } from "@voila.dev/ui/confirm-dialog";

export function ConfirmDialogExample() {
	return (
		<>
			<ConfirmDialog
				trigger={<Button variant="outline">Publish project</Button>}
				title="Publish this project?"
				description="Freelancers matching the required skills will be notified and can start applying."
				confirmLabel="Publish"
			/>
			<ConfirmDialog
				trigger={<Button variant="outline">Archive project</Button>}
				title="Archive this project?"
				description="The project will be hidden from the active list. You can restore it at any time."
				confirmLabel="Archive"
				onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1500))}
			/>
		</>
	);
}
