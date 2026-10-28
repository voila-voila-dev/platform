import type * as React from "react";
import { Heading } from "#/landing/components/heading.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof Heading> {}

export function ContactCardTitle({ className, ...props }: Props) {
	return (
		<Heading
			data-slot="contact-card-title"
			level="h2"
			className={cn("mb-2 text-xl", className)}
			{...props}
		/>
	);
}
