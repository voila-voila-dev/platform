import { Shortcut } from "@voila.dev/ui/shortcut";

export function ShortcutExample() {
	return (
		<div className="flex w-full max-w-56 flex-col gap-2">
			<div className="flex items-center rounded-lg border px-3 py-2 text-sm">
				Search
				<Shortcut>⌘K</Shortcut>
			</div>
			<div className="flex items-center rounded-lg border px-3 py-2 text-sm">
				Palette
				<Shortcut keys={["⌘", "K"]} />
			</div>
		</div>
	);
}
