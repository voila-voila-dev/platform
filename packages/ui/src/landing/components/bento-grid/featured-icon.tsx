import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function BentoGridFeaturedIcon({ className, ...props }: Props) {
	return (
		<div
			data-slot="bento-featured-icon"
			className={cn(
				"mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur [&_svg]:h-7 [&_svg]:w-7",
				className,
			)}
			{...props}
		/>
	);
}
