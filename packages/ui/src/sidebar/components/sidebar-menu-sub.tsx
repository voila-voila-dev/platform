import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"ul"> {}

export function SidebarMenuSub({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "ul",
		props: mergeProps<"ul">(
			{
				className: cn(
					"mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "sidebar-menu-sub" },
	});
}
