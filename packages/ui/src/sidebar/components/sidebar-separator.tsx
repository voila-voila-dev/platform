import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { Separator } from "#/separator/components/separator.tsx";

interface Props extends React.ComponentProps<typeof Separator> {}

export function SidebarSeparator({ className, ...props }: Props) {
	return (
		<Separator
			data-slot="sidebar-separator"
			className={cn("mx-2 w-auto bg-sidebar-border", className)}
			{...props}
		/>
	);
}
