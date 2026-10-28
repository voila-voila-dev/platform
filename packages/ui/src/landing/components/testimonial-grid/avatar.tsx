import type * as React from "react";
import {
	type TestimonialAvatarVariants,
	testimonialAvatarVariants,
} from "#/landing/components/testimonial-grid/testimonial-grid-variants.ts";

import { cn } from "#/lib/utils.ts";

interface Props
	extends React.ComponentProps<"span">,
		TestimonialAvatarVariants {}

/** Initial-letter avatar disc. */
export function TestimonialAvatar({ accent, className, ...props }: Props) {
	return (
		<span
			data-slot="testimonial-avatar"
			className={cn(testimonialAvatarVariants({ accent }), className)}
			{...props}
		/>
	);
}
