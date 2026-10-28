import { Button } from "@voila.dev/ui/button";
import { HoverCard } from "@voila.dev/ui/hover-card";

export function Default() {
	return (
		<HoverCard.Root>
			<HoverCard.Trigger render={<Button variant="link" />}>
				@nathan.guyot
			</HoverCard.Trigger>
			<HoverCard.Content>
				<div className="flex flex-col gap-1">
					<p className="font-medium">Nathan Guyot</p>
					<p className="text-muted-foreground">
						Product designer — covers launch weeks and design sprints for SaaS
						teams across Europe.
					</p>
					<p className="text-muted-foreground text-xs">Joined March 2026</p>
				</div>
			</HoverCard.Content>
		</HoverCard.Root>
	);
}
