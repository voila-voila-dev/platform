import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"h3"> {}

export function ArticleCardTitle({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "h3",
		props: mergeProps<"h3">(
			{
				className: cn(
					"mb-2 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-brand",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "article-card-title" },
	});
}
