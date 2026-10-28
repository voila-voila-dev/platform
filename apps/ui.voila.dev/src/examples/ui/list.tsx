import { CalendarCheckIcon, CodeIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/button";
import { Item } from "@voila.dev/ui/item";
import { List } from "@voila.dev/ui/list";

export function Default() {
	return (
		<List.Root aria-label="Open projects" className="w-full max-w-md">
			<List.Item variant="outline">
				<Item.Media variant="icon">
					<CalendarCheckIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>Landing page redesign</Item.Title>
					<Item.Description>
						Designer for the marketing site refresh, June 14.
					</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Button size="sm" variant="outline">
						Apply
					</Button>
				</Item.Actions>
			</List.Item>
			<List.Item variant="outline">
				<Item.Media variant="icon">
					<CodeIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>API integration sprint</Item.Title>
					<Item.Description>
						Two developers for the billing API integration, June 21.
					</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Button size="sm" variant="outline">
						Apply
					</Button>
				</Item.Actions>
			</List.Item>
		</List.Root>
	);
}
