import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

interface Props extends React.ComponentProps<"div"> {}

export function ArticleCardMeta({ className, ...props }: Props) {
	return (
		<div
			data-slot="article-card-meta"
			className={cn(
				"flex items-center justify-between text-xs text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}
