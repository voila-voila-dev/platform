import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"p"> {}

export function StatsRowValue({ className, ...props }: Props) {
	return (
		<p
			data-slot="stats-row-value"
			className={cn("text-3xl font-bold text-foreground", className)}
			{...props}
		/>
	);
}
