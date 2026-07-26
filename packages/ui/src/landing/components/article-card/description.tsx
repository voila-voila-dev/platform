import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"p"> {}

export function ArticleCardDescription({ className, ...props }: Props) {
	return (
		<p
			data-slot="article-card-description"
			className={cn(
				"mb-4 line-clamp-2 text-sm text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}
