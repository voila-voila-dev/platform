import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

interface Props extends React.ComponentProps<"span"> {}

/** Date / reading-time entry — icon child + text. */
export function ArticleCardMetaItem({ className, ...props }: Props) {
	return (
		<span
			data-slot="article-card-meta-item"
			className={cn(
				"flex items-center gap-1 [&_svg]:h-3.5 [&_svg]:w-3.5",
				className,
			)}
			{...props}
		/>
	);
}
