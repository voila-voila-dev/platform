import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function StepperTitle({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"text-sm leading-tight font-medium whitespace-nowrap group-data-[state=inactive]/stepper-item:text-muted-foreground",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "stepper-title" },
	});
}
