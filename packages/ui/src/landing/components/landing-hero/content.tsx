import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function LandingHeroContent({ className, ...props }: Props) {
	return (
		<div
			data-slot="landing-hero-content"
			className={cn("animate-fade-up max-w-2xl", className)}
			{...props}
		/>
	);
}
