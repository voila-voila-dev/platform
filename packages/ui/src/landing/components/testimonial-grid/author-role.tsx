import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"p"> {}

export function TestimonialAuthorRole({ className, ...props }: Props) {
	return (
		<p
			data-slot="testimonial-author-role"
			className={cn("text-xs text-muted-foreground", className)}
			{...props}
		/>
	);
}
