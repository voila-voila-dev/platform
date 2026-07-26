import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"a"> {}

/**
 * Blog article card — the clickable wrapper, an anchor by default; pass
 * `render` for a router Link. Compose: Root > Frame > Image | ImageFallback +
 * Content (Tags, Title, Description, Meta > MetaItem…/Arrow).
 */
export function ArticleCardRoot({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "a",
		props: mergeProps<"a">(
			{
				className: cn("group block", className),
			},
			props,
		),
		render,
		state: {
			slot: "article-card",
		},
	});
}
