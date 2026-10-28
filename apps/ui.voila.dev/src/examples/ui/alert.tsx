import {
	CheckCircleIcon,
	InfoIcon,
	WarningCircleIcon,
	WarningIcon,
} from "@phosphor-icons/react";
import { Alert } from "@voila.dev/ui/alert";
import { Button } from "@voila.dev/ui/button";

export function AlertVariants() {
	return (
		<div className="flex w-full flex-col gap-3">
			<Alert.Root>
				<InfoIcon />
				<Alert.Title>Project updated</Alert.Title>
				<Alert.Description>
					The client moved Friday's kickoff call to 3:00 PM.
				</Alert.Description>
			</Alert.Root>
			<Alert.Root variant="success">
				<CheckCircleIcon />
				<Alert.Title>Proposal accepted</Alert.Title>
				<Alert.Description>
					Camille Dubois will start on the project on Monday.
				</Alert.Description>
			</Alert.Root>
			<Alert.Root variant="warning">
				<WarningIcon />
				<Alert.Title>Report due soon</Alert.Title>
				<Alert.Description>
					Submit the project report within 48 hours to release the payment.
				</Alert.Description>
			</Alert.Root>
			<Alert.Root variant="destructive">
				<WarningCircleIcon />
				<Alert.Title>Payment failed</Alert.Title>
				<Alert.Description>
					We could not charge your card. Update your payment method.
				</Alert.Description>
			</Alert.Root>
		</div>
	);
}

export function AlertWithAction() {
	return (
		<div className="flex w-full flex-col gap-3">
			<Alert.Root>
				<Alert.Title>Application withdrawn</Alert.Title>
				<Alert.Description>
					You withdrew your proposal for the website redesign project.
				</Alert.Description>
				<Alert.Action>
					<Button variant="outline" size="xs">
						Undo
					</Button>
				</Alert.Action>
			</Alert.Root>
			<Alert.Root>
				<InfoIcon />
				<Alert.Title>New feature</Alert.Title>
				<Alert.Description>
					You can now message clients directly from a project page.
				</Alert.Description>
				<Alert.Close />
			</Alert.Root>
		</div>
	);
}
