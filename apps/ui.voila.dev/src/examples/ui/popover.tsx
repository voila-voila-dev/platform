import { Button } from "@voila.dev/ui/button";
import { Input } from "@voila.dev/ui/input";
import { Label } from "@voila.dev/ui/label";
import { Popover } from "@voila.dev/ui/popover";

export function Default() {
	return (
		<>
			<Popover.Root>
				<Popover.Trigger
					render={<Button variant="outline">Project details</Button>}
				/>
				<Popover.Content>
					<Popover.Header>
						<Popover.Title>Saturday launch support</Popover.Title>
						<Popover.Description>
							Northwind Trading — June 14, from 14:00 to 18:00.
						</Popover.Description>
					</Popover.Header>
					<p className="text-muted-foreground">
						A product designer is needed on call for the launch-day fixes.
					</p>
				</Popover.Content>
			</Popover.Root>
			<Popover.Root>
				<Popover.Trigger
					render={<Button variant="outline">Edit rate</Button>}
				/>
				<Popover.Content className="w-64">
					<Popover.Header>
						<Popover.Title>Hourly rate</Popover.Title>
					</Popover.Header>
					<div className="grid gap-2">
						<Label htmlFor="hourly-rate">Rate (USD)</Label>
						<Input id="hourly-rate" type="number" defaultValue="45" />
						<Button size="sm">Save</Button>
					</div>
				</Popover.Content>
			</Popover.Root>
		</>
	);
}

export function Placement() {
	return (
		<Popover.Root>
			<Popover.Trigger
				render={<Button variant="outline">Above, aligned left</Button>}
			/>
			<Popover.Content side="top" align="start" sideOffset={8}>
				<p className="text-muted-foreground">
					Flips to the other side when there is no room.
				</p>
			</Popover.Content>
		</Popover.Root>
	);
}
