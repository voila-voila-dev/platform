import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function ComparisonPanels({ className, ...props }: Props) {
	return (
		<div
			data-slot="comparison-panels"
			className={cn("mb-6 space-y-6", className)}
			{...props}
		/>
	);
}
