import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Gradient placeholder shown when the article has no cover image. */
export function ArticleCardImageFallback({
	className,
	children,
	...props
}: Props) {
	return (
		<div
			data-slot="article-card-image-fallback"
			className={cn(
				"relative aspect-video overflow-hidden rounded-t-lg bg-linear-to-br from-brand/20 to-highlight/20",
				className,
			)}
			{...props}
		>
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-6xl opacity-30">{children ?? "📝"}</span>
			</div>
		</div>
	);
}
