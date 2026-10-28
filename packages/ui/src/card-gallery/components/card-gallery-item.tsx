import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

/**
 * One tile of the grid. Render it as an `<a>` or `<button>` through `render`
 * to make the whole card interactive — the hover and focus affordances only
 * appear on those tags.
 */
export function CardGalleryItem({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"flex h-full min-w-0 flex-col items-center gap-2 rounded-lg border bg-card p-3 text-center outline-none transition-colors",
					"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&:is(a,button)]:cursor-pointer [&:is(a,button)]:hover:bg-muted/50 [&:is(a,button)]:active:bg-muted/50",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "card-gallery-item",
		},
	});
}
