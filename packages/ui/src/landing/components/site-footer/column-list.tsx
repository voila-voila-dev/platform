import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"ul"> {}

export function SiteFooterColumnList({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "ul",
		props: mergeProps<"ul">(
			{
				className: cn("space-y-3", className),
			},
			props,
		),
		render,
		state: { slot: "site-footer-column-list" },
	});
}
