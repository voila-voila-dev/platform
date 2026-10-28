import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function TestimonialFooter({ className, ...props }: Props) {
	return (
		<div
			data-slot="testimonial-footer"
			className={cn(
				"mt-6 flex flex-wrap items-center gap-3 border-t border-border/60 pt-5",
				className,
			)}
			{...props}
		/>
	);
}
