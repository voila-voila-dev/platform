import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

/**
 * Long-form prose wrapper (blog articles, legal pages). Requires
 * `@plugin "@tailwindcss/typography"` in the consuming app's stylesheet.
 */
function ProseArticle({
	className,
	render,
	...props
}: useRender.ComponentProps<"article">) {
	return useRender({
		defaultTagName: "article",
		props: mergeProps<"article">(
			{
				className: cn(
					"prose prose-lg md:prose-xl mx-auto max-w-none",
					"prose-blockquote:border-l-brand prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:pl-6 prose-blockquote:not-italic",
					"prose-p:text-muted-foreground",
					"prose-a:text-brand",
					"prose-strong:text-foreground",
					"prose-img:rounded-xl",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "prose-article",
		},
	});
}

export { ProseArticle };
