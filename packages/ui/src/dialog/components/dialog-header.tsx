import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function DialogHeader({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				// `pr-8` reserves room so the title never runs under the X button.
				className: cn("flex flex-col gap-2 pr-8", className),
			},
			props,
		),
		render,
		state: { slot: "dialog-header" },
	});
}
