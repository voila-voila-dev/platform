import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"p"> {}

export function BentoGridFeaturedDescription({ className, ...props }: Props) {
	return (
		<p
			data-slot="bento-featured-description"
			className={cn(
				"relative mt-6 text-base leading-relaxed text-white/90",
				className,
			)}
			{...props}
		/>
	);
}
