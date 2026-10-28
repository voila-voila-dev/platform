import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"h3"> {}

export function BentoGridItemTitle({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "h3",
		props: mergeProps<"h3">(
			{
				className: cn("mb-2 font-heading text-xl font-semibold", className),
			},
			props,
		),
		render,
		state: { slot: "bento-item-title" },
	});
}
