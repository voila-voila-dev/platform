import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function LandingHeroActions({ className, ...props }: Props) {
	return (
		<div
			data-slot="landing-hero-actions"
			className={cn("flex flex-col gap-4 sm:flex-row", className)}
			{...props}
		/>
	);
}
