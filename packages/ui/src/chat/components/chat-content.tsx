import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** The message column: header, bubbles, footer. */
export function ChatContent({ className, ...props }: Props) {
	return (
		<div
			data-slot="chat-content"
			className={cn(
				"flex w-full min-w-0 flex-col gap-1 [overflow-wrap:anywhere]",
				"group-data-[align=end]/message:*:data-slot:self-end",
				className,
			)}
			{...props}
		/>
	);
}
