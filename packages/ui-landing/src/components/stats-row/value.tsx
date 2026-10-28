import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

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
