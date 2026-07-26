import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function ChatUnreadSeparator({ className, children, ...props }: Props) {
	return (
		<div
			data-slot="chat-unread-separator"
			role="separator"
			className={cn(
				"flex items-center gap-3 py-1 font-medium text-destructive text-xs",
				"before:h-px before:flex-1 before:bg-destructive/40 after:h-px after:flex-1 after:bg-destructive/40",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
