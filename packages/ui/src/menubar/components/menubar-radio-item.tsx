import type * as React from "react";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";

interface Props extends React.ComponentProps<typeof DropdownMenu.RadioItem> {}

export function MenubarRadioItem({ className, ...props }: Props) {
	return (
		<DropdownMenu.RadioItem
			data-slot="menubar-radio-item"
			className={className}
			{...props}
		/>
	);
}
