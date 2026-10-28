import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";
import { Heading } from "#/components/heading.tsx";

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
