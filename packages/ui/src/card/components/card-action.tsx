import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function CardAction({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "card-action" },
	});
}
