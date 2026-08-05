import type * as React from "react";
import { MessageScrollerItem } from "#/chat/components/message-scroller-item.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof MessageScrollerItem> {}

/**
 * One transcript row: a message, marker, separator, typing row or load-more
 * row. Give it a stable `messageId` for scrollToMessage/visibility/prepend
 * preservation; set `scrollAnchor` on turn boundaries (e.g. the reader's own
 * messages) so a new turn lands at the reading line.
 */
export function ChatItem({ className, ...props }: Props) {
	return (
		<MessageScrollerItem
			data-slot="chat-item"
			className={cn(
				"min-w-0 shrink-0 [contain-intrinsic-size:auto_6rem] [content-visibility:auto]",
				className,
			)}
			{...props}
		/>
	);
}
