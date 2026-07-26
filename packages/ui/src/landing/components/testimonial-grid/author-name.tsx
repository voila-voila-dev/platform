import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"p"> {}

export function TestimonialAuthorName({ className, ...props }: Props) {
	return (
		<p
			data-slot="testimonial-author-name"
			className={cn("text-sm font-semibold text-foreground", className)}
			{...props}
		/>
	);
}
