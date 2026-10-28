import type * as React from "react";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";

interface Props extends React.ComponentProps<typeof DropdownMenu.Shortcut> {}

export function MenubarShortcut({ className, ...props }: Props) {
	return (
		<DropdownMenu.Shortcut
			data-slot="menubar-shortcut"
			className={className}
			{...props}
		/>
	);
}
