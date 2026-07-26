import { useContext } from "react";
import { FeatureGridToneContext } from "#/landing/components/feature-grid/context/feature-grid-context.ts";
import {
	type Tone,
	toneTextClass,
	toneTintBackgroundClass,
} from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"span"> {
	tone?: Tone;
}

export function FeatureGridCardIcon({ tone, className, ...props }: Props) {
	const inheritedTone = useContext(FeatureGridToneContext);
	const resolvedTone = tone ?? inheritedTone;

	return (
		<span
			data-slot="feature-grid-card-icon"
			className={cn(
				"mb-4 flex h-12 w-12 items-center justify-center rounded-xl [&_svg]:h-6 [&_svg]:w-6",
				toneTintBackgroundClass[resolvedTone],
				toneTextClass[resolvedTone],
				className,
			)}
			{...props}
		/>
	);
}
