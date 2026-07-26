import type * as React from "react";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof DropdownMenu.Trigger> {}

export function MenubarTrigger({ className, ...props }: Props) {
	return (
		<DropdownMenu.Trigger
			data-slot="menubar-trigger"
			className={cn(
				"flex items-center rounded-sm px-1.5 py-[2px] text-sm font-medium outline-hidden select-none hover:bg-muted aria-expanded:bg-muted",
				className,
			)}
			{...props}
		/>
	);
}
