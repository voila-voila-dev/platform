import type * as React from "react";
import { StepTracksToneContext } from "#/landing/components/step-tracks/context/step-tracks-context.ts";
import type { Tone } from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	tone?: Tone;
}

export function StepTracksTrack({
	tone = "primary",
	className,
	...props
}: Props) {
	return (
		<StepTracksToneContext.Provider value={tone}>
			<div
				data-slot="step-tracks-track"
				className={cn("animate-fade-up", className)}
				{...props}
			/>
		</StepTracksToneContext.Provider>
	);
}
