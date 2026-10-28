import { useContext } from "react";
import { StepTracksToneContext } from "#/landing/components/step-tracks/context/step-tracks-context.ts";
import {
	toneSolidClass,
	toneTextClass,
	toneTintBackgroundClass,
} from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	/** The step's position, shown inside the marker. You number the steps, not the track. */
	number: number;
}

export function StepTracksStepIcon({
	number,
	className,
	children,
	...props
}: Props) {
	const tone = useContext(StepTracksToneContext);

	return (
		<div
			data-slot="step-tracks-step-icon"
			className={cn(
				"relative z-10 h-14 w-14 shrink-0 rounded-xl bg-background",
				className,
			)}
			{...props}
		>
			<div
				className={cn(
					"flex h-full w-full items-center justify-center rounded-xl [&_svg]:h-6 [&_svg]:w-6",
					toneTintBackgroundClass[tone],
					toneTextClass[tone],
				)}
			>
				{children}
			</div>
			<span
				className={cn(
					"absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
					toneSolidClass[tone],
				)}
			>
				{number}
			</span>
		</div>
	);
}
