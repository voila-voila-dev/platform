import type * as React from "react";
import { Kbd, KbdGroup } from "#/components/kbd.tsx";
import { menuShortcutVariants } from "#/components/menu-variants.ts";
import { cn } from "#/lib/utils.ts";

/**
 * Right-aligned keyboard hint for menu rows, shared by
 * `DropdownMenuShortcut`, `ContextMenuShortcut`, `MenubarShortcut` and
 * `CommandShortcut`. Pass plain children ("⌘K") for the classic text hint, or
 * `keys` to render each key as a small `Kbd` chip instead.
 */
function Shortcut({
	className,
	keys,
	children,
	...props
}: React.ComponentProps<"span"> & {
	keys?: ReadonlyArray<string>;
}) {
	return (
		<span
			data-slot="shortcut"
			className={cn(menuShortcutVariants(), className)}
			{...props}
		>
			{keys === undefined ? (
				children
			) : (
				<KbdGroup>
					{keys.map((key) => (
						<Kbd key={key} size="sm">
							{key}
						</Kbd>
					))}
				</KbdGroup>
			)}
		</span>
	);
}

export { Shortcut };
