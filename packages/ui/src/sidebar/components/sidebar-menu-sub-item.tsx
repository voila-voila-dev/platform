import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"li"> {}

export function SidebarMenuSubItem({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "li",
		props: mergeProps<"li">(
			{
				className: cn("group/menu-sub-item relative", className),
			},
			props,
		),
		render,
		state: { slot: "sidebar-menu-sub-item" },
	});
}
