import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"ul"> {}

export function SiteHeaderNavList({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "ul",
		props: mergeProps<"ul">(
			{
				className: cn("flex items-center gap-6", className),
			},
			props,
		),
		render,
		state: { slot: "site-header-nav-list" },
	});
}
