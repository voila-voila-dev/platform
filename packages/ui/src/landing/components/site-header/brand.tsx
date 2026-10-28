import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"a"> {}

/** Logo slot — an anchor by default; pass `render` for a router Link. */
export function SiteHeaderBrand({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "a",
		props: mergeProps<"a">(
			{
				className: cn("flex items-center", className),
			},
			props,
		),
		render,
		state: {
			slot: "site-header-brand",
		},
	});
}
