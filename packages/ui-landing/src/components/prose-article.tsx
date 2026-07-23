import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@voila.dev/ui/lib/utils";

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
					"prose-blockquote:border-l-provider prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:pl-6 prose-blockquote:not-italic",
					"prose-p:text-muted-foreground",
					"prose-a:text-provider",
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
