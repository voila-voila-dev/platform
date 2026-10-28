import { Button } from "@voila.dev/ui/button";
import { ResponsiveSheet } from "@voila.dev/ui/responsive-sheet";

export function Default() {
	return (
		<ResponsiveSheet.Root>
			<ResponsiveSheet.Trigger render={<Button variant="outline" />}>
				Open email details
			</ResponsiveSheet.Trigger>
			<ResponsiveSheet.Content size="xl">
				<ResponsiveSheet.Header>
					<ResponsiveSheet.Title>Email details</ResponsiveSheet.Title>
					<ResponsiveSheet.Description>
						Resize the viewport below 768px to get the bottom drawer.
					</ResponsiveSheet.Description>
				</ResponsiveSheet.Header>
				<ResponsiveSheet.Body>
					<dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
						<dt className="text-muted-foreground">To</dt>
						<dd>camille@example.com</dd>
						<dt className="text-muted-foreground">Status</dt>
						<dd>Sent</dd>
					</dl>
				</ResponsiveSheet.Body>
				<ResponsiveSheet.Footer>
					<Button>Resend</Button>
				</ResponsiveSheet.Footer>
			</ResponsiveSheet.Content>
		</ResponsiveSheet.Root>
	);
}
