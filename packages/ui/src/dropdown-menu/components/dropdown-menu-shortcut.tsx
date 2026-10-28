import type * as React from "react";
import { Shortcut } from "#/shortcut/components/shortcut.tsx";

interface Props extends React.ComponentProps<typeof Shortcut> {}

export function DropdownMenuShortcut(props: Props) {
	return <Shortcut data-slot="dropdown-menu-shortcut" {...props} />;
}
