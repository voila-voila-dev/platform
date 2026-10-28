import { cn } from "@voila.dev/ui/utils";
import { useContext } from "react";
import { StepTracksToneContext } from "#/components/step-tracks/context/step-tracks-context.ts";
import { toneHoverBorderClass } from "#/lib/tones.ts";

interface Props extends React.ComponentProps<"div"> {}

export function StepTracksBody({ className, ...props }: Props) {
	const tone = useContext(StepTracksToneContext);

	return (
		<div
			data-slot="step-tracks-step-body"
			className={cn(
				"flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md",
				toneHoverBorderClass[tone],
				className,
			)}
			{...props}
		/>
	);
}
