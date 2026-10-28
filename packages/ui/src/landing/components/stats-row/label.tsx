import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"p"> {}

export function StatsRowLabel({ className, ...props }: Props) {
	return (
		<p
			data-slot="stats-row-label"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}
