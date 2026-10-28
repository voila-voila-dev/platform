import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { menuLabelVariants } from "#/menu/components/menu-variants.ts";

interface Props extends React.ComponentProps<"div"> {
	/** Indents the item to line up with siblings that have an icon or a checkmark. */
	inset?: boolean;
}

// Plain div, not Menu.GroupLabel: Base UI's GroupLabel throws when rendered
// outside a Menu.Group, and labels are routinely used standalone.
export function DropdownMenuLabel({ className, inset, ...props }: Props) {
	return (
		<div
			data-slot="dropdown-menu-label"
			data-inset={inset}
			className={cn(menuLabelVariants(), className)}
			{...props}
		/>
	);
}
