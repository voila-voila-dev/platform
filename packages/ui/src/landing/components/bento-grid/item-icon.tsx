import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function BentoGridItemIcon({ className, ...props }: Props) {
	return (
		<div
			data-slot="bento-item-icon"
			className={cn(
				"flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15 [&_svg]:h-6 [&_svg]:w-6",
				className,
			)}
			{...props}
		/>
	);
}
