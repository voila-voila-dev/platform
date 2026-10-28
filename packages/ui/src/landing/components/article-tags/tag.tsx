import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"span"> {}

export function ArticleTag({ className, ...props }: Props) {
	return (
		<span
			data-slot="article-tag"
			className={cn(
				"inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand transition-colors",
				className,
			)}
			{...props}
		/>
	);
}
