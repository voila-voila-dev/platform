import type * as React from "react";

import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"tr"> {}

export function TableRow({ className, ...props }: Props) {
	return (
		<tr
			data-slot="table-row"
			className={cn(
				"border-b transition-colors has-aria-expanded:bg-muted/50 data-selected:bg-muted in-[tbody]:hover:bg-muted/50",
				className,
			)}
			{...props}
		/>
	);
}
