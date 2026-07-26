import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { useContext } from "react";
import { StepTracksToneContext } from "#/landing/components/step-tracks/context/step-tracks-context.ts";
import { toneTextClass } from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"h3"> {}

export function StepTracksHeaderTitle({ className, render, ...props }: Props) {
	const tone = useContext(StepTracksToneContext);

	return useRender({
		defaultTagName: "h3",
		props: mergeProps<"h3">(
			{
				className: cn("font-semibold text-xl", toneTextClass[tone], className),
			},
			props,
		),
		render,
		state: { slot: "step-tracks-header-title" },
	});
}
