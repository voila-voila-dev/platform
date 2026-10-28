import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

interface Props extends React.ComponentProps<"div"> {}

export function ComparisonContent({ className, ...props }: Props) {
	return (
		<div
			data-slot="comparison-content"
			className={cn("min-w-0", className)}
			{...props}
		/>
	);
}
