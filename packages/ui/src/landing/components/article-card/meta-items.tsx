import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function ArticleCardMetaItems({ className, ...props }: Props) {
	return (
		<div
			data-slot="article-card-meta-items"
			className={cn("flex items-center gap-3", className)}
			{...props}
		/>
	);
}
