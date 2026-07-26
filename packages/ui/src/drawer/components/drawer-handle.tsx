import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function DrawerHandle({ className, ...props }: Props) {
	return (
		<div
			data-slot="drawer-handle"
			aria-hidden="true"
			className={cn(
				"mx-auto mt-4 h-1 w-24 shrink-0 rounded-full bg-muted-foreground/20",
				className,
			)}
			{...props}
		/>
	);
}
