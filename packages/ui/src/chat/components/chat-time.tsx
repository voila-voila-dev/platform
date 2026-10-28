import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"time"> {}

/** Timestamp inside a bubble (inherits the bubble's text color). */
export function ChatTime({ className, ...props }: Props) {
	return (
		<time
			data-slot="chat-time"
			className={cn("select-none text-xs opacity-70", className)}
			{...props}
		/>
	);
}
