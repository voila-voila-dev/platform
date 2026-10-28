import type * as React from "react";
import { ChatMarkerContent } from "#/chat/components/chat-marker-content.tsx";
import { chatMarkerVariants } from "#/chat/components/chat-marker-variants.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/**
 * "New messages" rule shown when opening a thread with unread messages.
 * Same anatomy as ChatDateSeparator, in the destructive accent.
 */
export function ChatUnreadSeparator({ className, children, ...props }: Props) {
	return (
		<div
			data-slot="chat-unread-separator"
			role="separator"
			className={cn(
				cn(chatMarkerVariants({ variant: "separator" })),
				"group/marker py-1 font-medium text-destructive text-xs before:bg-destructive/40 after:bg-destructive/40",
				className,
			)}
			{...props}
		>
			<ChatMarkerContent>{children}</ChatMarkerContent>
		</div>
	);
}
