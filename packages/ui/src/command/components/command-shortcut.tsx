import type * as React from "react";
import { Shortcut } from "#/shortcut/components/shortcut.tsx";

interface Props extends React.ComponentProps<typeof Shortcut> {}

export function CommandShortcut(props: Props) {
	return <Shortcut data-slot="command-shortcut" {...props} />;
}
