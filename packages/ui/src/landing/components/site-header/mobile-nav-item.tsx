import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"a"> {}

/** A mobile-menu entry — the anchor comes wrapped in its own `li`. */
export function SiteHeaderMobileNavItem({
	className,
	render,
	...props
}: Props) {
	const anchor = useRender({
		defaultTagName: "a",
		props: mergeProps<"a">(
			{
				className: cn(
					"block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "site-header-mobile-nav-item",
		},
	});

	return <li>{anchor}</li>;
}
