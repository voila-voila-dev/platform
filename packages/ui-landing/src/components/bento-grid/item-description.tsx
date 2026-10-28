import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

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
