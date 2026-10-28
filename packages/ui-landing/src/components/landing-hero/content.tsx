import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

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
