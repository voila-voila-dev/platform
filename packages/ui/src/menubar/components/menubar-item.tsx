import type * as React from "react";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";

interface Props extends React.ComponentProps<typeof DropdownMenu.Item> {}

export function MenubarItem({ className, ...props }: Props) {
	return (
		<DropdownMenu.Item
			data-slot="menubar-item"
			className={className}
			{...props}
		/>
	);
}
