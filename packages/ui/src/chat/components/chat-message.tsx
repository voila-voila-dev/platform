import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	align?: "start" | "end";
}

/**
 * One message row. `align="end"` mirrors the row for the current writer
 * (avatar on the right, content right-aligned).
 */
export function ChatMessage({ className, align = "start", ...props }: Props) {
	return (
		<div
			data-slot="chat-message"
			data-align={align}
			className={cn(
				"group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse",
				className,
			)}
			{...props}
		/>
	);
}
