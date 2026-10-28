import { Button } from "@voila.dev/ui/button";
import { Dialog } from "@voila.dev/ui/dialog";

export function Default() {
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

export function Sizes() {
	return (
		<>
			{(["sm", "default", "lg", "xl"] as const).map((size) => (
				<Dialog.Root key={size}>
					<Dialog.Trigger render={<Button variant="outline" />}>
						{size}
					</Dialog.Trigger>
					<Dialog.Content size={size}>
						<Dialog.Header>
							<Dialog.Title>Size “{size}”</Dialog.Title>
							<Dialog.Description>
								The panel grows; the padding and type scale stay put.
							</Dialog.Description>
						</Dialog.Header>
					</Dialog.Content>
				</Dialog.Root>
			))}
		</>
	);
}
