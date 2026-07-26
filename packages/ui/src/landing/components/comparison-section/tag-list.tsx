import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function ComparisonTagList({ className, ...props }: Props) {
	return (
		<div
			data-slot="comparison-tag-list"
			className={cn("mb-8 flex flex-wrap gap-2", className)}
			{...props}
		/>
	);
}
