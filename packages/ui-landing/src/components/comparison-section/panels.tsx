import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

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
