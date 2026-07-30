import { Kbd } from "@voila.dev/ui/kbd";

export function KbdExample() {
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
