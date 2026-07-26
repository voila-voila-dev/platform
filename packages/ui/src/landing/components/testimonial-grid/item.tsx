import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"figure"> {}

export function TestimonialItem({ className, ...props }: Props) {
	return (
		<figure
			data-slot="testimonial-item"
			className={cn(
				"animate-fade-up flex h-full min-w-0 flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md lg:p-8",
				className,
			)}
			{...props}
		/>
	);
}
