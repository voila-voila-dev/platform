import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { menuLabelVariants } from "#/menu/components/menu-variants.ts";

interface Props extends React.ComponentProps<"div"> {
	inset?: boolean;
}

// Plain div, not GroupLabel: Base UI's GroupLabel throws when rendered
// outside a Group, and labels are routinely used standalone.
export function ContextMenuLabel({ className, inset, ...props }: Props) {
	return (
		<div
			data-slot="context-menu-label"
			data-inset={inset}
			className={cn(menuLabelVariants(), className)}
			{...props}
		/>
	);
}
