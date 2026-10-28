import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Two bounds side by side — the layout shared by every range field. */
export function FilterRangeRow({ className, ...props }: Props) {
	return (
		<div
			data-slot="filter-range-row"
			className={cn("grid grid-cols-1 gap-2 sm:grid-cols-2", className)}
			{...props}
		/>
	);
}
