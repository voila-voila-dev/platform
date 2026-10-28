import type * as React from "react";

import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"tfoot"> {}

export function TableFooter({ className, ...props }: Props) {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn(
				"border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
				className,
			)}
			{...props}
		/>
	);
}
