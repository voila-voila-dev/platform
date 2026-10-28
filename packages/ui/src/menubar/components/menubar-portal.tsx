import type * as React from "react";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";

interface Props extends React.ComponentProps<typeof DropdownMenu.Portal> {}

export function MenubarPortal(props: Props) {
	return <DropdownMenu.Portal data-slot="menubar-portal" {...props} />;
}
