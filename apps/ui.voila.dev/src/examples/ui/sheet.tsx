import { Button } from "@voila.dev/ui/button";
import { Sheet } from "@voila.dev/ui/sheet";

export function Default() {
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

export function Sides() {
	return (
		<>
			{(["top", "right", "bottom", "left"] as const).map((side) => (
				<Sheet.Root key={side}>
					<Sheet.Trigger render={<Button variant="outline" />}>
						{side}
					</Sheet.Trigger>
					<Sheet.Content side={side}>
						<Sheet.Header>
							<Sheet.Title>From the {side}</Sheet.Title>
							<Sheet.Description>
								`size` measures across the edge it entered from.
							</Sheet.Description>
						</Sheet.Header>
					</Sheet.Content>
				</Sheet.Root>
			))}
		</>
	);
}
