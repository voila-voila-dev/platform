import type * as React from "react";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";

interface Props extends React.ComponentProps<typeof DropdownMenu.Sub> {}

export function MenubarSub(props: Props) {
	return <DropdownMenu.Sub data-slot="menubar-sub" {...props} />;
}
