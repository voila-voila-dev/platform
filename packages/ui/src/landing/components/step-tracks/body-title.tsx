import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"h4"> {}

export function StepTracksBodyTitle({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "h4",
		props: mergeProps<"h4">(
			{
				className: cn("mb-2 text-lg font-semibold", className),
			},
			props,
		),
		render,
		state: { slot: "step-tracks-step-title" },
	});
}
