import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"h3"> {}

export function NumberedCardTitle({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "h3",
		props: mergeProps<"h3">(
			{
				className: cn(
					"mb-2 font-heading text-xl font-bold tracking-tight text-foreground",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "numbered-cards-card-title" },
	});
}
