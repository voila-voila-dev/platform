import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn, proseLinkClassName } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function AlertTitle({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"font-medium group-has-[>svg]/alert:col-start-2",
					proseLinkClassName,
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "alert-title" },
	});
}
