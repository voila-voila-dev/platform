import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function StepTracksHeader({ className, ...props }: Props) {
	return (
		<div
			data-slot="step-tracks-header"
			className={cn("mb-8 flex items-center gap-4", className)}
			{...props}
		/>
	);
}
