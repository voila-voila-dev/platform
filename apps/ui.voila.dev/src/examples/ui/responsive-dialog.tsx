import { Button } from "@voila.dev/ui/button";
import { ResponsiveDialog } from "@voila.dev/ui/responsive-dialog";

export function ResponsiveDialogExample() {
	return (
		<ResponsiveDialog.Root>
			<ResponsiveDialog.Trigger render={<Button variant="outline" />}>
				Cancel project
			</ResponsiveDialog.Trigger>
			<ResponsiveDialog.Content>
				<ResponsiveDialog.Header>
					<ResponsiveDialog.Title>Cancel this project?</ResponsiveDialog.Title>
					<ResponsiveDialog.Description>
						Resize the viewport below 768px to get the bottom drawer.
					</ResponsiveDialog.Description>
				</ResponsiveDialog.Header>
				<ResponsiveDialog.Body>
					<p>
						The held payment is returned to the client's wallet once the
						cancellation is confirmed.
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
	);
}
