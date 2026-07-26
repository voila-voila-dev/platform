import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "#/lib/utils.ts";

interface Props
	extends React.ComponentProps<typeof DrawerPrimitive.Description> {}

export function DrawerDescription({ className, ...props }: Props) {
	return (
		<DrawerPrimitive.Description
			data-slot="drawer-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}
