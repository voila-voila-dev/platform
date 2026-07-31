import type * as React from "react";
import { Kbd } from "#/kbd/components/kbd.tsx";
import { cn } from "#/lib/utils.ts";
import { menuShortcutVariants } from "#/menu/components/menu-variants.ts";

interface Props extends React.ComponentProps<"span"> {
	/** Render each key as a small `Kbd` chip. Omit it and children are shown as plain text. */
	keys?: ReadonlyArray<string>;
}

/**
 * Right-aligned keyboard hint for menu rows, shared by
 * `DropdownMenu.Shortcut`, `ContextMenu.Shortcut`, `Menubar.Shortcut` and
 * `Command.Shortcut`. Pass plain children ("⌘K") for the classic text hint, or
 * `keys` to render each key as a small `Kbd` chip instead.
 */
export function Shortcut({ className, keys, children, ...props }: Props) {
	return (
		<span
			data-slot="shortcut"
			className={cn(menuShortcutVariants(), className)}
			{...props}
		>
			{keys === undefined ? (
				children
			) : (
				<Kbd.Group>
					{keys.map((key) => (
						<Kbd.Root key={key} size="sm">
							{key}
						</Kbd.Root>
					))}
				</Kbd.Group>
			)}
		</span>
	);
}
