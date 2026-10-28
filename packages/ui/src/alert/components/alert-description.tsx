import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn, proseLinkClassName } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function AlertDescription({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"text-sm text-balance text-muted-foreground md:text-pretty [&_p:not(:last-child)]:mb-4",
					proseLinkClassName,
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "alert-description" },
	});
}
