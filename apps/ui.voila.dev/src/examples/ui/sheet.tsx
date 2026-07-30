import { Button } from "@voila.dev/ui/button";
import { Sheet } from "@voila.dev/ui/sheet";

export function SheetExample() {
	return (
		<Sheet.Root>
			<Sheet.Trigger render={<Button variant="outline" />}>
				Open project details
			</Sheet.Trigger>
			<Sheet.Content>
				<Sheet.Header>
					<Sheet.Title>Project details</Sheet.Title>
					<Sheet.Description>
						On-site design support for the marketing site launch week.
					</Sheet.Description>
				</Sheet.Header>
				<div className="grid gap-2 px-4 text-sm">
					<p>Client: Northwind Trading</p>
					<p>Date: Saturday, June 14 — 2:00 PM</p>
					<p>Rate: 45 USD / hour</p>
				</div>
				<Sheet.Footer>
					<Button>Confirm engagement</Button>
					<Sheet.Close render={<Button variant="outline" />}>
						Cancel
					</Sheet.Close>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	);
}
