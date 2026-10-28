import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

interface Props extends React.ComponentProps<"blockquote"> {}

export function TestimonialQuote({ className, children, ...props }: Props) {
	return (
		<blockquote
			data-slot="testimonial-quote"
			className={cn("flex-1 text-foreground", className)}
			{...props}
		>
			<p className="leading-relaxed">{children}</p>
		</blockquote>
	);
}
