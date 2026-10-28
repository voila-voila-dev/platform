import { useContext } from "react";
import { StepTracksToneContext } from "#/landing/components/step-tracks/context/step-tracks-context.ts";
import { toneTextClass, toneTintBackgroundClass } from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function StepTracksHeaderIcon({ className, ...props }: Props) {
	const tone = useContext(StepTracksToneContext);

	return (
		<div
			data-slot="step-tracks-header-icon"
			className={cn(
				"flex h-12 w-12 shrink-0 items-center justify-center rounded-xl [&_svg]:h-6 [&_svg]:w-6",
				toneTintBackgroundClass[tone],
				toneTextClass[tone],
				className,
			)}
			{...props}
		/>
	);
}
