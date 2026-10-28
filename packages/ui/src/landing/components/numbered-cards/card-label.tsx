import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"span"> {}

/** The "Step N" label next to the icon. */
export function NumberedCardLabel({ className, ...props }: Props) {
	return (
		<span
			data-slot="numbered-cards-card-label"
			className={cn("text-sm font-semibold text-muted-foreground", className)}
			{...props}
		/>
	);
}
