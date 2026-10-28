import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

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
