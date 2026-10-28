import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function DrawerHeader({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					// `pr-8` on side drawers reserves room so the title never runs under
					// the X button; bottom/top drawers center on mobile, left-align on md+.
					"flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=left]/drawer-content:pr-8 group-data-[vaul-drawer-direction=right]/drawer-content:pr-8 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left md:group-data-[vaul-drawer-direction=top]/drawer-content:text-left",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "drawer-header" },
	});
}
