import { ContextMenu } from "@voila.dev/ui/context-menu";

export function Default() {
	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger className="flex h-36 w-72 items-center justify-center rounded-xl border border-dashed text-muted-foreground text-sm">
				Right-click here
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Label>Project</ContextMenu.Label>
				<ContextMenu.Item>
					Edit project
					<ContextMenu.Shortcut>⌘E</ContextMenu.Shortcut>
				</ContextMenu.Item>
				<ContextMenu.Item>Duplicate</ContextMenu.Item>
				<ContextMenu.Separator />
				<ContextMenu.Sub>
					<ContextMenu.SubTrigger>Assign freelancer</ContextMenu.SubTrigger>
					<ContextMenu.SubContent>
						<ContextMenu.Item>Nathan Guyot</ContextMenu.Item>
						<ContextMenu.Item>Marie Lefevre</ContextMenu.Item>
					</ContextMenu.SubContent>
				</ContextMenu.Sub>
				<ContextMenu.Separator />
				<ContextMenu.Item variant="destructive">
					Cancel project
				</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	);
}
