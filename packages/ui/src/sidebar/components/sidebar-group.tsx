import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function SidebarGroup({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn("relative flex w-full min-w-0 flex-col p-2", className),
			},
			props,
		),
		render,
		state: { slot: "sidebar-group" },
	});
}
