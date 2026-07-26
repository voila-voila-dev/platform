import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/**
 * Parallel tone-colored step tracks with a vertical connector line and numbered
 * icon tiles. Compose: Root > Track (tone) > Header (HeaderIcon + HeaderText >
 * HeaderTitle/HeaderSubtitle) + Steps > Step (StepIcon number + Body >
 * BodyTitle/BodyDescription).
 */
export function StepTracksRoot({ className, ...props }: Props) {
	return (
		<div
			data-slot="step-tracks"
			className={cn("grid gap-16 lg:grid-cols-2 lg:gap-12", className)}
			{...props}
		/>
	);
}
