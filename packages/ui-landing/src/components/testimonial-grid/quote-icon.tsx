import { QuotesIcon } from "@phosphor-icons/react";
import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

interface Props extends React.ComponentProps<typeof QuotesIcon> {}

export function TestimonialQuoteIcon({ className, ...props }: Props) {
	return (
		<QuotesIcon
			data-slot="testimonial-quote-icon"
			className={cn("mb-4 h-8 w-8 text-primary/30", className)}
			{...props}
		/>
	);
}
