import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Groups consecutive rows from the same sender. */
export function ChatGroup({ className, ...props }: Props) {
	return (
		<div
			data-slot="chat-group"
			className={cn("flex min-w-0 flex-col gap-2", className)}
			{...props}
		/>
	);
}
