import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

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
