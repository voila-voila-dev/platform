import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

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
