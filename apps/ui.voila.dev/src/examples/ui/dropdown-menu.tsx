import { Button } from "@voila.dev/ui/button";
import { DropdownMenu } from "@voila.dev/ui/dropdown-menu";

export function Default() {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger render={<Button variant="outline" />}>
				Project actions
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="w-56">
				<DropdownMenu.Label>Launch support — Saturday</DropdownMenu.Label>
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						Edit project
						<DropdownMenu.Shortcut>⌘E</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						Duplicate
						<DropdownMenu.Shortcut>⌘D</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>Assign freelancer</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item>Nathan Guyot</DropdownMenu.Item>
						<DropdownMenu.Item>Marie Lefevre</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Separator />
				<DropdownMenu.Item variant="destructive">
					Cancel project
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
