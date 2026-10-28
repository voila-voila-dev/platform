import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"p"> {}

export function BentoGridItemDescription({ className, ...props }: Props) {
	return (
		<p
			data-slot="bento-item-description"
			className={cn("text-sm leading-relaxed text-muted-foreground", className)}
			{...props}
		/>
	);
}
