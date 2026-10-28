import type * as React from "react";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof DropdownMenu.SubContent> {}

export function MenubarSubContent({ className, ...props }: Props) {
	return (
		<DropdownMenu.SubContent
			data-slot="menubar-sub-content"
			className={cn("min-w-32", className)}
			{...props}
		/>
	);
}
