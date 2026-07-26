import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"img"> {
	alt: string;
}

export function ArticleCardImage({ className, alt, ...props }: Props) {
	return (
		<div
			data-slot="article-card-image"
			className="relative aspect-video overflow-hidden rounded-t-lg"
		>
			<img
				alt={alt}
				loading="lazy"
				className={cn(
					"h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
					className,
				)}
				{...props}
			/>
			<div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
		</div>
	);
}
