import type * as React from "react";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";

interface Props
	extends React.ComponentProps<typeof DropdownMenu.CheckboxItem> {}

export function MenubarCheckboxItem({ className, ...props }: Props) {
	return (
		<DropdownMenu.CheckboxItem
			data-slot="menubar-checkbox-item"
			className={className}
			{...props}
		/>
	);
}
