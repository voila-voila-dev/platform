import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/**
 * Bordered contact cards (email/phone). Compose: Root > Card > CardTitle +
 * CardDescription + an action (e.g. a `@voila.dev/ui` Button rendered as a
 * `mailto:`/`tel:` anchor).
 */
export function ContactCardsRoot({ className, ...props }: Props) {
	return (
		<div
			data-slot="contact-cards"
			className={cn("grid gap-8 md:grid-cols-2", className)}
			{...props}
		/>
	);
}
