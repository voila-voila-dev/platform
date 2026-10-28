import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"span"> {}

export function ComparisonTag({ className, ...props }: Props) {
	return (
		<span
			data-slot="comparison-tag"
			className={cn(
				"rounded-full border border-border bg-background px-3 py-1 text-sm",
				className,
			)}
			{...props}
		/>
	);
}
