import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function StatsRowDivider({ className, ...props }: Props) {
	return (
		<div
			data-slot="stats-row-divider"
			className={cn("h-12 w-px bg-border", className)}
			{...props}
		/>
	);
}
