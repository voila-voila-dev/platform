import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function ArticleCardContent({ className, ...props }: Props) {
	return (
		<div
			data-slot="article-card-content"
			className={cn("p-5", className)}
			{...props}
		/>
	);
}
