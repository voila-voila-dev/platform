import type * as React from "react";
import { ArticleTags } from "#/landing/components/article-tags/index.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function ArticleCardTags({ className, ...props }: Props) {
	return (
		<ArticleTags.Root
			data-slot="article-card-tags"
			className={cn("mb-3", className)}
			{...props}
		/>
	);
}
