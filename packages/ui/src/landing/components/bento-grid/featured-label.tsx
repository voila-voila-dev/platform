import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"p"> {}

export function BentoGridFeaturedLabel({ className, ...props }: Props) {
	return (
		<p
			data-slot="bento-featured-label"
			className={cn(
				"mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70",
				className,
			)}
			{...props}
		/>
	);
}
