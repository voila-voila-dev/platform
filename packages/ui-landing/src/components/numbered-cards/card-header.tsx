import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

interface Props extends React.ComponentProps<"div"> {}

export function NumberedCardHeader({ className, ...props }: Props) {
	return (
		<div
			data-slot="numbered-cards-card-header"
			className={cn("mb-4 flex items-center gap-3", className)}
			{...props}
		/>
	);
}
