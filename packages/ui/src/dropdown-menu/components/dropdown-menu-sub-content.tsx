import type * as React from "react";
import { DropdownMenuContent } from "#/dropdown-menu/components/dropdown-menu-content.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof DropdownMenuContent> {}

export function DropdownMenuSubContent({
	alignOffset = -3,
	side = "inline-end",
	sideOffset = 0,
	className,
	...props
}: Props) {
	return (
		<DropdownMenuContent
			data-slot="dropdown-menu-sub-content"
			className={cn("shadow-lg", className)}
			alignOffset={alignOffset}
			side={side}
			sideOffset={sideOffset}
			{...props}
		/>
	);
}
