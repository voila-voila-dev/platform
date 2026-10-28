import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"ul"> {}

export function SidebarMenu({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "ul",
		props: mergeProps<"ul">(
			{
				// gap-1: without it two adjacent items with a background — the active
				// one and a hovered one — merge into a single block.
				className: cn("flex w-full min-w-0 flex-col gap-1", className),
			},
			props,
		),
		render,
		state: { slot: "sidebar-menu" },
	});
}
