import { Kbd } from "@voila.dev/ui/kbd";

export function Default() {
	return (
		<>
			<Kbd.Root>⌘K</Kbd.Root>
			<Kbd.Root size="sm">Esc</Kbd.Root>
			<Kbd.Group>
				<Kbd.Root>⌘</Kbd.Root>
				<Kbd.Root>⇧</Kbd.Root>
				<Kbd.Root>P</Kbd.Root>
			</Kbd.Group>
		</>
	);
}
