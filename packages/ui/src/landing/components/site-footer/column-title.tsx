import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"h3"> {}

export function SiteFooterColumnTitle({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "h3",
		props: mergeProps<"h3">(
			{
				className: cn("mb-4 text-sm font-semibold text-foreground", className),
			},
			props,
		),
		render,
		state: { slot: "site-footer-column-title" },
	});
}
