import type * as React from "react";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof DropdownMenu.Label> {
	inset?: boolean;
}

export function MenubarLabel({ className, inset, ...props }: Props) {
	return (
		<DropdownMenu.Label
			data-slot="menubar-label"
			data-inset={inset}
			className={cn(
				"px-1.5 py-1 text-sm font-medium data-inset:pl-7",
				className,
			)}
			{...props}
		/>
	);
}
