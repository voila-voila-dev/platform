import * as React from "react";

/**
 * Open/close state for a CommandDialog bound to a global hotkey
 * (⌘+key on macOS, Ctrl+key elsewhere). Defaults to ⌘K / Ctrl+K.
 */
export function useCommandPalette(key = "k") {
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			// Synthetic keydowns (browser autofill, IME composition) can arrive
			// without a `key`, so guard before lowercasing it.
			if (
				event.key !== undefined &&
				event.key.toLowerCase() === key.toLowerCase() &&
				(event.metaKey || event.ctrlKey)
			) {
				event.preventDefault();
				setOpen((previousOpen) => !previousOpen);
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [key]);

	return { open, setOpen };
}
