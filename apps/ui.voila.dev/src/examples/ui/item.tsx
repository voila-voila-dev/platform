import { CalendarCheckIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/button";
import { Item } from "@voila.dev/ui/item";

export function Default() {
	return (
		<Item.Root variant="outline" className="w-full max-w-md">
			<Item.Media variant="icon">
				<CalendarCheckIcon />
			</Item.Media>
			<Item.Content>
				<Item.Title>Landing page redesign</Item.Title>
				<Item.Description>
					Designer needed for the marketing site refresh, June 14 through June
					18.
				</Item.Description>
			</Item.Content>
			<Item.Actions>
				<Button size="sm" variant="outline">
					Apply
				</Button>
			</Item.Actions>
		</Item.Root>
	);
}
