import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";
import { Heading } from "#/components/heading.tsx";

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
