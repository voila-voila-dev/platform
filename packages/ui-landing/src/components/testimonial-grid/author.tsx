import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

interface Props extends React.ComponentProps<"figcaption"> {}

export function TestimonialAuthor({ className, ...props }: Props) {
	return (
		<figcaption
			data-slot="testimonial-author"
			className={cn("min-w-0", className)}
			{...props}
		/>
	);
}
