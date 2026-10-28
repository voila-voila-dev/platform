import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function CardTitle({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "card-title" },
	});
}
