import { cn } from "@voila.dev/ui/utils";
import { useContext } from "react";
import { StepTracksToneContext } from "#/components/step-tracks/context/step-tracks-context.ts";
import { toneConnectorLineClass } from "#/lib/tones.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Stepper wrapper — owns the vertical connector line behind the icon tiles. */
export function StepTracksSteps({ className, children, ...props }: Props) {
	const tone = useContext(StepTracksToneContext);

	return (
		<div
			data-slot="step-tracks-steps"
			className={cn("relative", className)}
			{...props}
		>
			<div
				className={cn(
					"absolute bottom-10 left-7 top-2 w-px",
					toneConnectorLineClass[tone],
				)}
			/>
			<div className="grid gap-6">{children}</div>
		</div>
	);
}
