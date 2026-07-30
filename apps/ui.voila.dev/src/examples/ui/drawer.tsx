import { Button } from "@voila.dev/ui/button";
import { Drawer } from "@voila.dev/ui/drawer";

export function DrawerExample() {
	return (
		<Drawer.Root>
			<Drawer.Trigger asChild>
				<Button variant="outline">View project details</Button>
			</Drawer.Trigger>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Launch support — Saturday</Drawer.Title>
					<Drawer.Description>
						Remote, 14:00 to 18:00. One product designer requested.
					</Drawer.Description>
				</Drawer.Header>
				<Drawer.Footer>
					<Button>Apply to this project</Button>
					<Drawer.Close asChild>
						<Button variant="outline">Close</Button>
					</Drawer.Close>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Root>
	);
}
