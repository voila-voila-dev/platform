import { WarningIcon } from "@phosphor-icons/react";
import { AlertDialog } from "@voila.dev/ui/alert-dialog";
import { Button } from "@voila.dev/ui/button";

export function Default() {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger render={<Button variant="outline" />}>
				Cancel project
			</AlertDialog.Trigger>
			<AlertDialog.Content size="sm">
				<AlertDialog.Header>
					<AlertDialog.Media>
						<WarningIcon className="text-destructive" />
					</AlertDialog.Media>
					<AlertDialog.Title>Cancel this project?</AlertDialog.Title>
					<AlertDialog.Description>
						The freelancer will be notified and the engagement released. This
						action cannot be undone.
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
	);
}
