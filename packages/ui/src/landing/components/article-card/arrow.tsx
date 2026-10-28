import { ArrowUpRightIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof ArrowUpRightIcon> {}

export function ArticleCardArrow({ className, ...props }: Props) {
	return (
		<ArrowUpRightIcon
			data-slot="article-card-arrow"
			className={cn(
				"h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
				className,
			)}
			{...props}
		/>
	);
}
