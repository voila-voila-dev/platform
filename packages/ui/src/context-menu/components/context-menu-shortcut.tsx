import type * as React from "react";
import { Shortcut } from "#/shortcut/components/shortcut.tsx";

interface Props extends React.ComponentProps<typeof Shortcut> {}

export function ContextMenuShortcut(props: Props) {
	return <Shortcut data-slot="context-menu-shortcut" {...props} />;
}
