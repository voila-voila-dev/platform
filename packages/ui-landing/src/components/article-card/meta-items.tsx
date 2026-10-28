import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

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
