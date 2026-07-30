import { Button } from "@voila.dev/ui/button";
import { Dialog } from "@voila.dev/ui/dialog";

export function DialogExample() {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button variant="outline" />}>
				Invite a freelancer
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Invite a freelancer</Dialog.Title>
					<Dialog.Description>
						Send an invitation to an independent freelancer so they can apply to
						your workspace's projects.
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
	);
}
