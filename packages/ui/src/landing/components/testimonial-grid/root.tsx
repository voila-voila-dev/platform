import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/**
 * Testimonial figure cards (quote, avatar initial, star rating). Compose: Root >
 * Item > QuoteIcon + Quote + Footer (Avatar + Author > AuthorName/AuthorRole +
 * Rating).
 */
export function TestimonialGridRoot({ className, ...props }: Props) {
	return (
		<div
			data-slot="testimonial-grid"
			className={cn("grid gap-6 md:grid-cols-3", className)}
			{...props}
		/>
	);
}
