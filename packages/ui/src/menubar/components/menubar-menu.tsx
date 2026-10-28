import type * as React from "react";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";

interface Props extends React.ComponentProps<typeof DropdownMenu.Root> {}

export function MenubarMenu(props: Props) {
	return <DropdownMenu.Root data-slot="menubar-menu" {...props} />;
}
