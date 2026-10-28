import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Illustration column — hidden below `lg`, like the Astro heroes. */
export function LandingHeroMedia({ className, ...props }: Props) {
	return (
		<div
			data-slot="landing-hero-media"
			className={cn("hidden lg:block", className)}
			{...props}
		/>
	);
}
