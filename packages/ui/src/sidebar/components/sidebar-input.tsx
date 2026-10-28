import type * as React from "react";
import { Input } from "#/input/components/input.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof Input> {}

export function SidebarInput({ className, ...props }: Props) {
	return (
		<Input
			data-slot="sidebar-input"
			className={cn("h-8 w-full bg-background shadow-none", className)}
			{...props}
		/>
	);
}
