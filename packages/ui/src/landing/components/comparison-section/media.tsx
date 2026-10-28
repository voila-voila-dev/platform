import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Illustration column — hidden below `lg`. */
export function ComparisonMedia({ className, ...props }: Props) {
	return (
		<div
			data-slot="comparison-media"
			className={cn("hidden lg:block", className)}
			{...props}
		/>
	);
}
