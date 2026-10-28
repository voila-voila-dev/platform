import type * as React from "react";
import { Heading } from "#/landing/components/heading.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof Heading> {}

export function LandingHeroTitle({ className, ...props }: Props) {
	return (
		<Heading
			data-slot="landing-hero-title"
			level="h1"
			className={cn("mb-6", className)}
			{...props}
		/>
	);
}
