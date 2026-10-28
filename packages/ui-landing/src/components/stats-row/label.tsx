import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

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
