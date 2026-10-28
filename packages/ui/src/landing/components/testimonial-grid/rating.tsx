import { StarIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { accentHighlightStarClass } from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	/** How many stars to fill, out of five. */
	count?: number;
}

export function TestimonialRating({ count = 5, className, ...props }: Props) {
	return (
		<div
			data-slot="testimonial-rating"
			className={cn("ml-auto flex shrink-0 gap-0.5", className)}
			{...props}
		>
			{Array.from({ length: count }, (_, index) => (
				<StarIcon
					// Stars are a static decorative sequence — the index is the identity.
					key={index}
					weight="fill"
					className={cn("h-3.5 w-3.5", accentHighlightStarClass)}
				/>
			))}
		</div>
	);
}
