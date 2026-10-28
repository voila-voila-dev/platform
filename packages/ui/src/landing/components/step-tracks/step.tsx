import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function StepTracksStep({ className, ...props }: Props) {
	return (
		<div
			data-slot="step-tracks-step"
			className={cn("animate-fade-up relative flex gap-5", className)}
			{...props}
		/>
	);
}
