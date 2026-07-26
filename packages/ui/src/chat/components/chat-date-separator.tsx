import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function ChatDateSeparator({ className, children, ...props }: Props) {
	return (
		<div
			data-slot="chat-date-separator"
			role="separator"
			className={cn(
				"flex items-center gap-3 py-1 text-xs text-muted-foreground",
				"before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
