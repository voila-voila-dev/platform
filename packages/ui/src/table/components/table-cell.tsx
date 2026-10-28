import type * as React from "react";

import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"td"> {}

export function TableCell({ className, ...props }: Props) {
	return (
		<td
			data-slot="table-cell"
			className={cn(
				"p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0",
				className,
			)}
			{...props}
		/>
	);
}
