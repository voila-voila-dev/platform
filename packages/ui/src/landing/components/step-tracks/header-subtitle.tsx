import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"p"> {}

export function StepTracksHeaderSubtitle({ className, ...props }: Props) {
	return (
		<p
			data-slot="step-tracks-header-subtitle"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}
