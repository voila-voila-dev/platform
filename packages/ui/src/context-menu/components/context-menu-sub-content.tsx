import type * as React from "react";
import { ContextMenuContent } from "#/context-menu/components/context-menu-content.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof ContextMenuContent> {}

export function ContextMenuSubContent({
	className,
	side = "right",
	...props
}: Props) {
	return (
		<ContextMenuContent
			data-slot="context-menu-sub-content"
			className={cn("shadow-lg", className)}
			side={side}
			{...props}
		/>
	);
}
