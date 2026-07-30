import { Avatar } from "@voila.dev/ui/avatar";

export function AvatarExample() {
	return (
		<>
			<Avatar.Root size="sm">
				<Avatar.Fallback>CD</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Image
					src="https://github.com/shadcn.png"
					alt="Camille Dubois"
				/>
				<Avatar.Fallback>CD</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root size="lg">
				<Avatar.Fallback>CD</Avatar.Fallback>
				<Avatar.Badge />
			</Avatar.Root>
			<Avatar.Group>
				<Avatar.Root>
					<Avatar.Fallback>CD</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Fallback>NG</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Fallback>ML</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.GroupCount>+4</Avatar.GroupCount>
			</Avatar.Group>
		</>
	);
}
