import type * as React from "react";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";

interface Props extends React.ComponentProps<typeof DropdownMenu.SubTrigger> {}

export function MenubarSubTrigger({ className, ...props }: Props) {
	return (
		<DropdownMenu.SubTrigger
			data-slot="menubar-sub-trigger"
			className={className}
			{...props}
		/>
	);
}
