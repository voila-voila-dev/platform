import type * as React from "react";
import { Text } from "#/landing/components/text.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof Text> {}

export function LandingHeroLead({ className, ...props }: Props) {
	return (
		<Text
			data-slot="landing-hero-lead"
			variant="lead"
			className={cn("mb-8 max-w-xl", className)}
			{...props}
		/>
	);
}
