import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function BentoGridFeaturedContent({ className, ...props }: Props) {
	return (
		<div
			data-slot="bento-featured-content"
			className={cn("relative", className)}
			{...props}
		/>
	);
}
