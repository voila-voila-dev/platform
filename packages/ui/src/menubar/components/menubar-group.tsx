import type * as React from "react";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";

interface Props extends React.ComponentProps<typeof DropdownMenu.Group> {}

export function MenubarGroup(props: Props) {
	return <DropdownMenu.Group data-slot="menubar-group" {...props} />;
}
