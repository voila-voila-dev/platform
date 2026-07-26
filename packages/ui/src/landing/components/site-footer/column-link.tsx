import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"a"> {}

/** A column entry — the anchor comes wrapped in its own `li`. */
export function SiteFooterColumnLink({ className, render, ...props }: Props) {
	const anchor = useRender({
		defaultTagName: "a",
		props: mergeProps<"a">(
			{
				className: cn(
					"text-sm text-muted-foreground transition-colors hover:text-foreground",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "site-footer-column-link",
		},
	});

	return <li>{anchor}</li>;
}
