import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"h2"> {}

/** Renders an `h2` - pass `render` to fit the page's heading outline. */
export function SectionTitle({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "h2",
		props: mergeProps<"h2">(
			{
				className: cn("text-lg font-semibold tracking-tight", className),
			},
			props,
		),
		render,
		state: {
			slot: "section-title",
		},
	});
}
