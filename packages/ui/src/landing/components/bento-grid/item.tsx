import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"article"> {
	/** Spans two columns on desktop (the last tile of an odd set). */
	wide?: boolean;
}

export function BentoGridItem({ wide = false, className, ...props }: Props) {
	return (
		<article
			data-slot="bento-item"
			className={cn(
				"animate-fade-up group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md lg:p-8",
				wide && "lg:col-span-2",
				className,
			)}
			{...props}
		/>
	);
}
