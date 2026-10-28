import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"h3"> {}

export function BentoGridFeaturedTitle({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "h3",
		props: mergeProps<"h3">(
			{
				className: cn(
					"font-heading text-5xl font-bold tracking-tight",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "bento-featured-title" },
	});
}
