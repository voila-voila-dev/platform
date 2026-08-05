import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Name/status line above the bubbles. */
export function ChatHeader({ className, ...props }: Props) {
	return (
		<div
			data-slot="chat-header"
			className={cn(
				"flex max-w-full min-w-0 items-center gap-1.5 px-3 font-medium text-muted-foreground text-xs group-has-data-[variant=ghost]/message:px-0",
				className,
			)}
			{...props}
		/>
	);
}
