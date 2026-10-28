import type * as React from "react";
import { Text } from "#/landing/components/text.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof Text> {}

export function ContactCardDescription({ className, ...props }: Props) {
	return (
		<Text
			data-slot="contact-card-description"
			className={cn("mb-4 text-muted-foreground", className)}
			{...props}
		/>
	);
}
